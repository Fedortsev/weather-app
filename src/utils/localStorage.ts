import { City } from '@/types/weather';

const CITIES_STORAGE_KEY = 'weather_app_cities';

export const loadCitiesFromStorage = (): City[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CITIES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load cities from localStorage:', error);
    return [];
  }
};

export const saveCitiesToStorage = (cities: City[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(cities));
  } catch (error) {
    console.error('Failed to save cities to localStorage:', error);
  }
};

export const addCityToStorage = (city: City): City[] => {
  const cities = loadCitiesFromStorage();
  const updatedCities = [...cities, city];
  saveCitiesToStorage(updatedCities);
  return updatedCities;
};

export const removeCityFromStorage = (cityId: string): City[] => {
  const cities = loadCitiesFromStorage();
  const updatedCities = cities.filter((city) => city.id !== cityId);
  saveCitiesToStorage(updatedCities);
  return updatedCities;
};
