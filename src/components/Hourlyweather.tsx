import { weatherCodes } from "../constants";

type WeatherIconKey = "sunny" | "clouds" | "mist" | "rain" | "moderate_heavy_rain" | "snow" | "thunder" | "thunder_rain";

type HourlyWeather = {
  time: string;
  temp_c: number;
  condition: {
    code: number;
  };
  is_day: number;
};

type HourlyWeatherItemProps = {
  hourlyWeather: HourlyWeather;
};

const HourlyWeatherItem = ({ hourlyWeather }: HourlyWeatherItemProps) => {
  // Extract and format temperature and time
  const temperature = Math.floor(hourlyWeather.temp_c);
  const time = hourlyWeather.time.split(" ")[1]?.substring(0, 5) ?? "";

  // Find the appropriate weather icon
  let weatherIcon: WeatherIconKey = "sunny";
  const foundIcon = (Object.keys(weatherCodes) as WeatherIconKey[]).find((icon) =>
    weatherCodes[icon].includes(hourlyWeather.condition.code)
  );
  if (foundIcon) {
    weatherIcon = foundIcon;
  }

  // If sunny at night, show cloudy icon instead
  if (weatherIcon === "sunny" && !hourlyWeather.is_day) {
    weatherIcon = "clouds";
  }

  return (
    <li className="weather-item">
      <p className="time">{time}</p>
      <img src={`icons/${weatherIcon}.svg`} className="weather-icon" alt="Weather icon" />
      <p className="temperature">{temperature}°</p>
    </li>
  );
};

export default HourlyWeatherItem;
