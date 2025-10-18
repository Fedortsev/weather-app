import citiesReducer, { initializeCities, addCity, removeCity } from '../citiesSlice';
import { mockCityKyiv, mockCityLviv } from '@/__mocks__';

describe('citiesSlice', () => {
  const mockCity = mockCityKyiv;

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    expect(citiesReducer(undefined, { type: 'unknown' })).toEqual({
      cities: [],
      isInitialized: false,
    });
  });

  it('should handle initializeCities', () => {
    const state = citiesReducer(undefined, initializeCities());
    expect(state.isInitialized).toBe(true);
    expect(state.cities).toEqual([]);
  });

  it('should handle initializeCities with stored data', () => {
    localStorage.setItem('weather_app_cities', JSON.stringify([mockCity]));
    const state = citiesReducer(undefined, initializeCities());
    expect(state.isInitialized).toBe(true);
    expect(state.cities).toEqual([mockCity]);
  });

  it('should handle addCity', () => {
    const initialState = {
      cities: [],
      isInitialized: true,
    };
    const state = citiesReducer(initialState, addCity(mockCity));
    expect(state.cities).toEqual([mockCity]);
  });

  it('should not add duplicate city', () => {
    const initialState = {
      cities: [mockCity],
      isInitialized: true,
    };
    const state = citiesReducer(initialState, addCity(mockCity));
    expect(state.cities).toEqual([mockCity]);
  });

  it('should handle removeCity', () => {
    const initialState = {
      cities: [mockCity],
      isInitialized: true,
    };
    const state = citiesReducer(initialState, removeCity(mockCity.id));
    expect(state.cities).toEqual([]);
  });

  it('should handle removeCity with multiple cities', () => {
    const initialState = {
      cities: [mockCity, mockCityLviv],
      isInitialized: true,
    };
    const state = citiesReducer(initialState, removeCity(mockCity.id));
    expect(state.cities).toEqual([mockCityLviv]);
  });
});
