import { City } from '@/types/weather';

export const mockCityKyiv: City = {
  id: '703448-1234567890',
  name: 'Київ',
  addedAt: 1234567890000,
};

export const mockCityLviv: City = {
  id: '702550-1234567891',
  name: 'Львів',
  addedAt: 1234567891000,
};

export const mockCityOdesa: City = {
  id: '698740-1234567892',
  name: 'Одеса',
  addedAt: 1234567892000,
};

export const mockCities: City[] = [mockCityKyiv, mockCityLviv, mockCityOdesa];

export const mockCitySimple: City = {
  id: 'simple-1',
  name: 'Київ',
  addedAt: 1234567890000,
};
