import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WeatherData, ForecastData } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Weather', 'Forecast'],
  endpoints: (builder) => ({
    getWeatherByCity: builder.query<WeatherData, string>({
      query: (cityName) => ({
        url: '/weather',
        params: {
          q: cityName,
          appid: API_KEY,
          units: 'metric',
          lang: 'uk',
        },
      }),
      providesTags: (_result, _error, cityName) => [{ type: 'Weather', id: cityName }],
    }),
    getForecastByCity: builder.query<ForecastData, string>({
      query: (cityName) => ({
        url: '/forecast',
        params: {
          q: cityName,
          appid: API_KEY,
          units: 'metric',
          lang: 'uk',
          cnt: 8,
        },
      }),
      providesTags: (_result, _error, cityName) => [{ type: 'Forecast', id: cityName }],
    }),
  }),
});

export const {
  useGetWeatherByCityQuery,
  useLazyGetWeatherByCityQuery,
  useGetForecastByCityQuery,
  useLazyGetForecastByCityQuery,
} = weatherApi;
