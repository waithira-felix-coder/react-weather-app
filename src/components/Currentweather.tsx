import { weatherCodes } from "../constants";

type WeatherIconKey = keyof typeof weatherCodes;

type CurrentWeatherProps = {
  currentWeather: {
    temperature: number;
    description: string;
    weatherIcon: WeatherIconKey;
  } | null;
};

const CurrentWeather = ({ currentWeather }: CurrentWeatherProps) => {
  if (!currentWeather) return null;

  return (
    <div className="current-weather">
      <img
        src={`icons/${currentWeather.weatherIcon}.svg`}
        className="weather-icon"
        alt={currentWeather.description}
      />
      <h2 className="temperature">
        {currentWeather.temperature} <span>°C</span>
      </h2>
      <p className="description">{currentWeather.description}</p>
    </div>
  );
};

export default CurrentWeather;
