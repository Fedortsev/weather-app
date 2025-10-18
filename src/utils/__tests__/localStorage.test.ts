import {
  loadCitiesFromStorage,
  saveCitiesToStorage,
  addCityToStorage,
  removeCityFromStorage,
} from '../localStorage';
import { mockCitySimple, mockCityLviv } from '@/__mocks__';

describe('localStorage utils', () => {
  const mockCity = mockCitySimple;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('loadCitiesFromStorage', () => {
    it('should return empty array when no data in storage', () => {
      const result = loadCitiesFromStorage();
      expect(result).toEqual([]);
    });

    it('should return cities from storage', () => {
      const cities = [mockCity];
      localStorage.setItem('weather_app_cities', JSON.stringify(cities));
      const result = loadCitiesFromStorage();
      expect(result).toEqual(cities);
    });

    it('should return empty array on parse error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.setItem('weather_app_cities', 'invalid json');
      const result = loadCitiesFromStorage();
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveCitiesToStorage', () => {
    it('should save cities to storage', () => {
      const cities = [mockCity];
      saveCitiesToStorage(cities);
      const stored = localStorage.getItem('weather_app_cities');
      expect(stored).toBe(JSON.stringify(cities));
    });
  });

  describe('addCityToStorage', () => {
    it('should add city to storage', () => {
      const result = addCityToStorage(mockCity);
      expect(result).toEqual([mockCity]);
      const stored = localStorage.getItem('weather_app_cities');
      expect(stored).toBe(JSON.stringify([mockCity]));
    });

    it('should add city to existing cities', () => {
      localStorage.setItem('weather_app_cities', JSON.stringify([mockCityLviv]));
      const result = addCityToStorage(mockCity);
      expect(result).toEqual([mockCityLviv, mockCity]);
    });
  });

  describe('removeCityFromStorage', () => {
    it('should remove city from storage', () => {
      localStorage.setItem('weather_app_cities', JSON.stringify([mockCity]));
      const result = removeCityFromStorage(mockCity.id);
      expect(result).toEqual([]);
    });

    it('should remove only specified city', () => {
      localStorage.setItem('weather_app_cities', JSON.stringify([mockCity, mockCityLviv]));
      const result = removeCityFromStorage(mockCity.id);
      expect(result).toEqual([mockCityLviv]);
    });
  });
});
