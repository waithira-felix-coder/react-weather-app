import type { RefObject } from "react";

type SearchSectionProps = {
  getWeatherDetails: (apiUrl: string) => Promise<void>;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

const SearchSection = ({ getWeatherDetails, searchInputRef }: SearchSectionProps) => {
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Handles city search form submission
  const handleCitySearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector(".search-input") as HTMLInputElement | null;
    if (!input) return;

    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${input.value}&days=2`;
    getWeatherDetails(API_URL); // Fetches weather details for the entered city
  };

  // Gets user's current location (latitude/longitude)
  const handleLocationSearch = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;
        getWeatherDetails(API_URL); // Fetches weather data for user's current location
        if (window.innerWidth >= 768) searchInputRef.current?.focus();
      },
      () => {
        alert("Location access denied. Please enable permissions to use this feature.");
      }
    );
  };

  return (
    <div className="search-section">
      <form action="#" className="search-form" onSubmit={handleCitySearch}>
        <span className="material-symbols-rounded"></span>
        <input type="search" placeholder="Enter a city name" className="search-input" ref={searchInputRef} required />
      </form>
      <button className="location-button" onClick={handleLocationSearch} aria-label="Get current location">
        <span className="material-symbols-rounded">Search</span>
      </button>
    </div>
  );
};

export default SearchSection;
