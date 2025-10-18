'use client';

import { Container, Typography, Box } from '@mui/material';
import { AddCityForm } from '@/components/AddCityForm/AddCityForm';
import { CityCard } from '@/components/CityCard/CityCard';
import { useAppSelector } from '@/store/hooks';
import styles from './page.module.scss';

export default function Home() {
  const cities = useAppSelector((state) => state.cities.cities);

  return (
    <div className={styles['weather-page']}>
      <Container maxWidth="lg" className={styles['weather-page__container']}>
        <Box className={styles['weather-page__header']}>
          <Typography variant="h3" component="h1" className={styles['weather-page__title']}>
            ☀️ Погода у ваших містах
          </Typography>
          <Typography variant="body1" className={styles['weather-page__subtitle']}>
            Додайте міста, щоб відстежувати погоду в них
          </Typography>
        </Box>

        <AddCityForm />

        {cities.length === 0 ? (
          <Box className={styles['weather-page__empty-state']}>
            <Typography variant="h5" color="text.secondary">
              Додайте своє перше місто
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Почніть вводити назву міста у поле вище
            </Typography>
          </Box>
        ) : (
          <Box className={styles['weather-page__cities-grid']}>
            {cities.map((city) => (
              <Box key={city.id} className={styles['weather-page__city-card']}>
                <CityCard cityId={city.id} cityName={city.name} />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </div>
  );
}
