import { WeatherData, ForecastData } from '@/types/weather';

/**
 * Mock weather data for Kyiv
 */
export const mockWeatherDataKyiv: WeatherData = {
  id: 703448,
  name: 'Київ',
  sys: { country: 'UA' },
  main: {
    temp: 20,
    feels_like: 18,
    temp_min: 18,
    temp_max: 22,
    pressure: 1013,
    humidity: 65,
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'ясно',
      icon: '01d',
    },
  ],
  wind: { speed: 3.5, deg: 180 },
  clouds: { all: 0 },
  dt: 1234567890,
  timezone: 7200,
};

/**
 * Mock weather data for Lviv
 */
export const mockWeatherDataLviv: WeatherData = {
  id: 702550,
  name: 'Львів',
  sys: { country: 'UA' },
  main: {
    temp: 18,
    feels_like: 16,
    temp_min: 15,
    temp_max: 20,
    pressure: 1015,
    humidity: 70,
  },
  weather: [
    {
      id: 801,
      main: 'Clouds',
      description: 'невелика хмарність',
      icon: '02d',
    },
  ],
  wind: { speed: 4.2, deg: 220 },
  clouds: { all: 25 },
  dt: 1234567890,
  timezone: 7200,
};

/**
 * Mock forecast data for testing
 */
export const mockForecastData: ForecastData = {
  list: [
    {
      dt: 1234567890,
      main: {
        temp: 20,
        feels_like: 18,
        temp_min: 18,
        temp_max: 22,
        pressure: 1013,
        humidity: 65,
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'ясно',
          icon: '01d',
        },
      ],
      wind: { speed: 3.5, deg: 180 },
      pop: 0,
      dt_txt: '2024-01-01 12:00:00',
    },
    {
      dt: 1234578890,
      main: {
        temp: 22,
        feels_like: 20,
        temp_min: 20,
        temp_max: 24,
        pressure: 1012,
        humidity: 60,
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'ясно',
          icon: '01d',
        },
      ],
      wind: { speed: 3.0, deg: 180 },
      pop: 0,
      dt_txt: '2024-01-01 15:00:00',
    },
  ],
  city: {
    id: 703448,
    name: 'Київ',
    country: 'UA',
    timezone: 7200,
  },
};
