import React, { useState } from 'react';
import { 
  WiDaySunny, WiDayRain, WiDayCloudy, WiDaySnow, WiDayThunderstorm,
  WiNightClear, WiNightRain, WiNightCloudy, WiNightSnow, WiNightThunderstorm
} from 'react-icons/wi';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';
import './WeatherCard.css';

const WeatherCard = ({ weather }) => {
  const [unit, setUnit] = useState('Celsius');

  if (!weather || !weather.current) {
    return <div className="weather-card loading">Loading...</div>;
  }

  const { current, forecast } = weather;
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const convertTemperature = (temp) => {
    return unit === 'Celsius' ? temp : (temp * 9/5) + 32;
  };

  const temperature = convertTemperature(current.main?.temp ?? 0);
  const humidity = current.main?.humidity ?? 0;
  const windSpeed = current.wind?.speed ?? 0;
  const cityName = current.name ?? 'Unknown';
  const country = current.sys?.country ?? '';

  const getCountryName = (countryCode) => {
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return regionNames.of(countryCode);
    } catch (error) {
      return countryCode;
    }
  };

  const getIcon = (condition) => {
    const iconMappings = {
      'Clear': <WiDaySunny />,
      'Rain': <WiDayRain />,
      'Clouds': <WiDayCloudy />,
      'Snow': <WiDaySnow />,
      'Thunderstorm': <WiDayThunderstorm />,
      'Night Clear': <WiNightClear />,
      'Night Rain': <WiNightRain />,
      'Night Clouds': <WiNightCloudy />,
      'Night Snow': <WiNightSnow />,
      'Night Thunderstorm': <WiNightThunderstorm />,
    };

    return iconMappings[condition] || <WiDaySunny />;
  };

  const getBackground = (condition) => {
    const backgroundMappings = {
      'Clear': 'linear-gradient(to bottom, #FFB75E, #ED8F03)',
      'Rain': 'linear-gradient(to bottom, #A1C4FD, #C2E9FB)',
      'Clouds': 'linear-gradient(to bottom, #C9D6FF, #E2E2E2)',
      'Snow': 'linear-gradient(to bottom, #D4FC79, #96E6A1)',
      'Thunderstorm': 'linear-gradient(to bottom, #616161, #9BC7E6)',
    };

    return backgroundMappings[condition] || 'linear-gradient(to bottom, #FFB75E, #ED8F03)';
  };

  const getHourlyData = () => {
    return forecast.list.slice(0, 8).map((item) => ({
      time: new Date(item.dt_txt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(convertTemperature(item.main.temp))
    }));
  };

  const getDailyForecast = () => {
    const daily = [];
    for (let i = 0; i < forecast.list.length; i++) {
      const date = new Date(forecast.list[i].dt_txt).getDate();
      if (!daily[date]) daily[date] = [];
      daily[date].push(forecast.list[i]);
    }
    return Object.entries(daily).map(([date, temps]) => {
      const highTemp = Math.max(...temps.map(t => convertTemperature(t.main.temp)));
      const lowTemp = Math.min(...temps.map(t => convertTemperature(t.main.temp)));
      return {
        day: days[new Date(temps[0].dt_txt).getDay()],
        highTemp: Math.round(highTemp),
        lowTemp: Math.round(lowTemp),
        condition: temps[0].weather[0].main
      };
    }).slice(0, 5);
  };

  const getCurrentDate = () => {
    const date = new Date();
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return { day, dateNum, month };
  };

  const { day, dateNum, month } = getCurrentDate();

  return (
    <div className="weather-card">
      <div className="temperature-switch">
        <label>
          <input
            type="radio"
            name="unit"
            value="Celsius"
            checked={unit === 'Celsius'}
            onChange={() => setUnit('Celsius')}
          />
          °C
        </label>
        <label>
          <input
            type="radio"
            name="unit"
            value="Fahrenheit"
            checked={unit === 'Fahrenheit'}
            onChange={() => setUnit('Fahrenheit')}
          />
          °F
        </label>
      </div>
      <div className="left-panel" style={{ background: getBackground(current.weather[0].main) }}>
        <div className="current-temp">
          <div className="temp-icon">{getIcon(current.weather[0].main)}</div>
          <div className="temp-value">{Math.round(temperature)}°</div>
        </div>
      </div>
      
      <div className="right-panel">
        <div className="header">
          <div className="date">
            <div>{day},</div>
            <div>{dateNum} {month}</div>
          </div>
          <div className="location">
            <h1>{cityName}</h1>
            <p>{getCountryName(country)}</p>
          </div>
          <div className="conditions">
            <div>
              <WiHumidity /> Precipitation {humidity}%
            </div>
            <div>
              <WiHumidity /> Humidity {humidity}%
            </div>
            <div>
              <WiStrongWind /> Wind {Math.round(windSpeed)} km/h
            </div>
          </div>
        </div>

        <div className="forecast">
          <div className="daily-forecast">
            {getDailyForecast().map((day, index) => (
              <div key={index} className="day-forecast">
                <span>{day.day}</span>
                <span>{getIcon(day.condition)}</span>
                <span>{day.highTemp}° {day.lowTemp}°</span>
              </div>
            ))}
          </div>
          
          <div className="hourly-forecast">
            <div className="hourly-points">
              {getHourlyData().map((hour, index) => (
                <div key={index} className="hour-point">
                  {hour.temp}°
                </div>
              ))}
            </div>
            <div className="time-labels">
              {getHourlyData().map((hour, index) => (
                <span key={index}>{hour.time}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
