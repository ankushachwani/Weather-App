import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/weatherCard';
import { getWeatherData } from './utils/weatherApi';
import { FiSearch } from 'react-icons/fi';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [currentCity, setCurrentCity] = useState('Cape Town');

  useEffect(() => {
    fetchWeather(currentCity);
  }, [currentCity]);

  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherData(city);
      if (data) {
        setWeather(data);
      } else {
        setError('City not found. Please try another city.');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentCity(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>Weather</h1>
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a city..."
            />
            <button type="submit">
              <FiSearch />
            </button>
          </form>
        </header>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <WeatherCard weather={weather} />
        )}
      </div>
    </div>
  );
}

export default App;