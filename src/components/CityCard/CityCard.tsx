'use client';

import { Card, CardContent, CardActions, Typography, IconButton, Box, Chip } from '@mui/material';
import { Refresh, Delete } from '@mui/icons-material';
import Image from 'next/image';
import { useGetWeatherByCityQuery } from '@/store/weatherApi';
import { useAppDispatch } from '@/store/hooks';
import { removeCity } from '@/store/citiesSlice';
import { useRouter } from 'next/navigation';
import styles from './CityCard.module.scss';

interface CityCardProps {
  cityId: string;
  cityName: string;
}

export function CityCard({ cityId, cityName }: CityCardProps) {
  const { data, isLoading, error, refetch } = useGetWeatherByCityQuery(cityName);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    refetch();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeCity(cityId));
  };

  const handleCardClick = () => {
    router.push(`/city/${encodeURIComponent(cityName)}`);
  };

  if (isLoading) {
    return (
      <Card className={`${styles['city-card']} ${styles['city-card--loading']}`}>
        <CardContent>
          <Typography variant="h6">{cityName}</Typography>
          <Typography>Завантаження...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${styles['city-card']} ${styles['city-card--error']}`}>
        <CardContent>
          <Typography variant="h6">{cityName}</Typography>
          <Typography color="error">Помилка завантаження</Typography>
        </CardContent>
        <CardActions className={styles['city-card__actions']}>
          <IconButton onClick={handleRefresh} size="small" color="primary">
            <Refresh />
          </IconButton>
          <IconButton onClick={handleDelete} size="small" color="error">
            <Delete />
          </IconButton>
        </CardActions>
      </Card>
    );
  }

  if (!data) return null;

  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <Card className={styles['city-card']} onClick={handleCardClick}>
      <CardContent className={styles['city-card__content']}>
        <Box className={styles['city-card__header']}>
          <Typography variant="h5" component="h2">
            {data.name}, {data.sys.country}
          </Typography>
          <Box className={styles['city-card__weather-icon']}>
            <Image src={weatherIcon} alt={data.weather[0].description} width={100} height={100} />
          </Box>
        </Box>

        <Box className={styles['city-card__temperature']}>
          <Typography variant="h2" component="div">
            {temp}°C
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Відчувається як {feelsLike}°C
          </Typography>
        </Box>

        <Box className={styles['city-card__description']}>
          <Typography variant="h6" textTransform="capitalize">
            {data.weather[0].description}
          </Typography>
        </Box>

        <Box className={styles['city-card__details']}>
          <Chip label={`Вологість: ${data.main.humidity}%`} size="small" />
          <Chip label={`Вітер: ${data.wind.speed} м/с`} size="small" />
          <Chip label={`Тиск: ${data.main.pressure} гПа`} size="small" />
        </Box>
      </CardContent>

      <CardActions className={styles['city-card__actions']}>
        <IconButton onClick={handleRefresh} size="small" color="primary" aria-label="refresh">
          <Refresh />
        </IconButton>
        <IconButton onClick={handleDelete} size="small" color="error" aria-label="delete">
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
}
