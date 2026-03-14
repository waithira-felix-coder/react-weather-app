import { useEffect, useRef, useState } from "react";
import SearchSection from "./components/SearchSection";
import CurrentWeather from "./components/Currentweather";
import HourlyWeatherItem from "./components/Hourlyweather";
import NoResultsDiv from "./components/NoResults";
import { weatherCodes } from "./constants";

type WeatherIconKey = "sunny" | "clouds" | "mist" | "rain" | "moderate_heavy_rain" | "snow" | "thunder" | "thunder_rain";

type WeatherCondition = {
  code: number;
  text: string;
};

type HourlyWeather = {
  time: string;
  time_epoch: number;
  temp_c: number;
  condition: WeatherCondition;
  is_day: number;
};

type CurrentWeather = {
  temperature: number;
  description: string;
  weatherIcon: WeatherIconKey;
};

const App = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyWeather[]>([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

  const filterHourlyForecast = (hourlyData: HourlyWeather[]) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 12 * 60 * 60 * 1000;

    // Filter the hourly data to only include the next 24 hours
    const next12HoursData = hourlyData.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24Hours;
    });

    setHourlyForecasts(next12HoursData);
  };

  // Fetches weather details based on the API URL
  const getWeatherDetails = async (API_URL: string) => {
    setHasNoResults(false);
    if (window.innerWidth <= 768) searchInputRef.current?.blur();

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch weather data");
      const data: any = await response.json();

      // Extract current weather data
      const temperature = Math.floor(data.current.temp_c);
      const description = data.current.condition.text;
      let weatherIcon: WeatherIconKey = "sunny";
      const foundIcon = (Object.keys(weatherCodes) as WeatherIconKey[]).find((icon) =>
        weatherCodes[icon].includes(data.current.condition.code)
      );
      if (foundIcon) {
        weatherIcon = foundIcon;
      }

      // If sunny at night, show cloudy icon instead
      if (weatherIcon === "sunny" && !data.current.is_day) {
        weatherIcon = "clouds";
      }

      setCurrentWeather({ temperature, description, weatherIcon });

      // Combine hourly data from both forecast days
      const combinedHourlyData: HourlyWeather[] = [
        ...data.forecast.forecastday[0].hour,
        ...data.forecast.forecastday[1].hour,
      ];

      if (searchInputRef.current) {
        searchInputRef.current.value = data.location.name;
      }

      filterHourlyForecast(combinedHourlyData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Set setHasNoResults state if there's an error
      setHasNoResults(true);
    }
  };

  // Fetch default city (Nakuru) weather data on initial render
  useEffect(() => {
    const defaultCity = "Nakuru";
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultCity}&days=2`;
    getWeatherDetails(API_URL);
  }, [API_KEY]);

  return (
    <div className="container">
      {/* Search section */}
      <SearchSection getWeatherDetails={getWeatherDetails} searchInputRef={searchInputRef} />
      {/* Conditionally render based on hasNoResults state */}
      {hasNoResults ? (
        <NoResultsDiv />
      ) : (
        <div className="weather-section">
          {/* Current weather */}
          <CurrentWeather currentWeather={currentWeather} />
          {/* Hourly weather forecast list */}
          <div className="hourly-forecast">
            <ul className="weather-list">
              {hourlyForecasts.map((hourlyWeather) => (
                <HourlyWeatherItem key={hourlyWeather.time_epoch} hourlyWeather={hourlyWeather} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
