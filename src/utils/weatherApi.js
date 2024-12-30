import axios from 'axios';

const API_KEY = 'ea80f27eeca1c9094fb563fe9a480936';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (city) => {
  try {
    const currentWeather = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const forecast = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    return {
      current: currentWeather.data,
      forecast: forecast.data
    };
  } catch (error) {
    console.error('API call error:', error);
    return null;
  }
};