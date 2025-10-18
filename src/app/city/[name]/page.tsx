'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
import { useGetWeatherByCityQuery, useGetForecastByCityQuery } from '@/store/weatherApi';
import { LineChart } from '@mui/x-charts/LineChart';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ name: string }>;
}

export default function CityDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const cityName = decodeURIComponent(resolvedParams.name);
  const router = useRouter();

  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useGetWeatherByCityQuery(cityName);

  const {
    data: forecastData,
    isLoading: forecastLoading,
    error: forecastError,
  } = useGetForecastByCityQuery(cityName);

  const handleBack = () => {
    router.push('/');
  };

  const handleRefresh = () => {
    refetchWeather();
  };

  if (weatherLoading) {
    return (
      <div className={styles['city-detail']}>
        <Container maxWidth="lg" className={styles['city-detail__loading']}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Завантаження погоди...
          </Typography>
        </Container>
      </div>
    );
  }

  if (weatherError || !weatherData) {
    return (
      <div className={styles['city-detail']}>
        <Container maxWidth="lg" className={styles['city-detail__container']}>
          <Alert severity="error">
            Помилка завантаження даних про погоду. Перевірте назву міста.
          </Alert>
          <Box sx={{ mt: 2 }}>
            <IconButton onClick={handleBack} className={styles['city-detail__back-button']}>
              <ArrowBack />
            </IconButton>
          </Box>
        </Container>
      </div>
    );
  }

  const temp = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const weatherIcon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;

  const chartData =
    forecastData?.list.map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      temp: Math.round(item.main.temp),
      timestamp: item.dt,
    })) || [];

  return (
    <div className={styles['city-detail']}>
      <Container maxWidth="lg" className={styles['city-detail__container']}>
        <Box className={styles['city-detail__header']}>
          <IconButton onClick={handleBack} className={styles['city-detail__back-button']}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            {weatherData.name}, {weatherData.sys.country}
          </Typography>
          <IconButton onClick={handleRefresh} color="primary">
            <Refresh />
          </IconButton>
        </Box>

        <Paper className={styles['city-detail__main-card']}>
          <Box className={styles['city-detail__weather-grid']}>
            <Box className={styles['city-detail__weather-section']}>
              <Box className={styles['city-detail__current-weather']}>
                <Image
                  src={weatherIcon}
                  alt={weatherData.weather[0].description}
                  width={120}
                  height={120}
                />
                <Typography
                  variant="h2"
                  component="div"
                  className={styles['city-detail__temperature']}
                >
                  {temp}°C
                </Typography>
                <Typography variant="h6" className={styles['city-detail__description']}>
                  {weatherData.weather[0].description}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                  Відчувається як {feelsLike}°C
                </Typography>
              </Box>
            </Box>

            <Box className={styles['city-detail__weather-section']}>
              <Box className={styles['city-detail__details']}>
                <Typography variant="h6" gutterBottom>
                  Детальна інформація
                </Typography>
                <Box className={styles['city-detail__details-grid']}>
                  <Box className={styles['city-detail__detail-item']}>
                    <Typography variant="body2" color="text.secondary">
                      Мін. температура
                    </Typography>
                    <Typography variant="h6">{Math.round(weatherData.main.temp_min)}°C</Typography>
                  </Box>
                  <Box className={styles['city-detail__detail-item']}>
                    <Typography variant="body2" color="text.secondary">
                      Макс. температура
                    </Typography>
                    <Typography variant="h6">{Math.round(weatherData.main.temp_max)}°C</Typography>
                  </Box>
                  <Box className={styles['city-detail__detail-item']}>
                    <Typography variant="body2" color="text.secondary">
                      Вологість
                    </Typography>
                    <Typography variant="h6">{weatherData.main.humidity}%</Typography>
                  </Box>
                  <Box className={styles['city-detail__detail-item']}>
                    <Typography variant="body2" color="text.secondary">
                      Тиск
                    </Typography>
                    <Typography variant="h6">{weatherData.main.pressure} гПа</Typography>
                  </Box>
                  <Box className={styles['city-detail__detail-item']}>
                    <Typography variant="body2" color="text.secondary">
                      Швидкість вітру
                    </Typography>
                    <Typography variant="h6">{weatherData.wind.speed} м/с</Typography>
                  </Box>
                  <Box className={styles['city-detail__detail-item']}>
                    <Typography variant="body2" color="text.secondary">
                      Хмарність
                    </Typography>
                    <Typography variant="h6">{weatherData.clouds.all}%</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {forecastLoading && (
          <Paper className={styles['city-detail__chart-card']}>
            <Box className={styles['city-detail__loading-chart']}>
              <CircularProgress />
              <Typography>Завантаження прогнозу...</Typography>
            </Box>
          </Paper>
        )}

        {!forecastLoading && !forecastError && chartData.length > 0 && (
          <Paper className={styles['city-detail__chart-card']}>
            <Typography variant="h6" gutterBottom>
              Прогноз температури на найближчі 24 години
            </Typography>
            <Box className={styles['city-detail__chart-container']}>
              <LineChart
                xAxis={[
                  {
                    data: chartData.map((_, index) => index),
                    scaleType: 'point',
                    valueFormatter: (value) => chartData[value]?.time || '',
                  },
                ]}
                yAxis={[
                  {
                    min: Math.floor(Math.min(...chartData.map((item) => item.temp)) - 2),
                    max: Math.ceil(Math.max(...chartData.map((item) => item.temp)) + 2),
                    valueFormatter: (value: number) => `${value}°C`,
                  },
                ]}
                series={[
                  {
                    data: chartData.map((item) => item.temp),
                    label: 'Температура (°C)',
                    color: '#1976d2',
                    curve: 'catmullRom',
                    showMark: true,
                  },
                ]}
                height={350}
                margin={{ left: 60, right: 20, top: 30, bottom: 70 }}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
            <Box className={styles['city-detail__forecast-details']}>
              {forecastData?.list.slice(0, 8).map((item, index) => (
                <Chip
                  key={item.dt}
                  label={`${chartData[index].time}: ${chartData[index].temp}°C`}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Paper>
        )}
      </Container>
    </div>
  );
}
