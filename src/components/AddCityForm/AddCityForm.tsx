'use client';

import { useState, FormEvent } from 'react';
import { TextField, Button, Box, Paper, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCity } from '@/store/citiesSlice';
import { useLazyGetWeatherByCityQuery } from '@/store/weatherApi';
import styles from './AddCityForm.module.scss';

export function AddCityForm() {
  const [cityName, setCityName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.cities.cities);

  const [fetchWeather, { isLoading }] = useLazyGetWeatherByCityQuery();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = cityName.trim();

    if (!trimmedName) {
      setError('Будь ласка, введіть назву міста');
      return;
    }

    const exists = cities.some((city) => city.name.toLowerCase() === trimmedName.toLowerCase());

    if (exists) {
      setError('Це місто вже додано до списку');
      return;
    }

    const result = await fetchWeather(trimmedName);

    if ('error' in result) {
      setError('Місто не знайдено. Перевірте правильність написання.');
      return;
    }

    if (result.data) {
      const newCity = {
        id: `${result.data.id}-${Date.now()}`,
        name: result.data.name,
        addedAt: Date.now(),
      };

      dispatch(addCity(newCity));
      setCityName('');
    }
  };

  return (
    <Paper className={styles['add-city-form']}>
      <form onSubmit={handleSubmit} className={styles['add-city-form__form']}>
        <Box className={styles['add-city-form__input-group']}>
          <TextField
            fullWidth
            label="Додати місто"
            variant="outlined"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            disabled={isLoading}
            placeholder="Наприклад: Київ"
            className={styles['add-city-form__input']}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || !cityName.trim()}
            startIcon={<Add />}
            className={`${styles['add-city-form__button']} ${
              isLoading ? styles['add-city-form__button--loading'] : ''
            } ${isLoading || !cityName.trim() ? styles['add-city-form__button--disabled'] : ''}`}
          >
            {isLoading ? 'Перевірка...' : 'Додати'}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" className={styles['add-city-form__alert']}>
            {error}
          </Alert>
        )}
      </form>
    </Paper>
  );
}
