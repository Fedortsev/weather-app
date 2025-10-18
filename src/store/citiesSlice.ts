import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { City } from '@/types/weather';
import {
  loadCitiesFromStorage,
  addCityToStorage,
  removeCityFromStorage,
} from '@/utils/localStorage';

interface CitiesState {
  cities: City[];
  isInitialized: boolean;
}

const initialState: CitiesState = {
  cities: [],
  isInitialized: false,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    initializeCities: (state) => {
      if (!state.isInitialized) {
        state.cities = loadCitiesFromStorage();
        state.isInitialized = true;
      }
    },
    addCity: (state, action: PayloadAction<City>) => {
      const exists = state.cities.some((city) => city.id === action.payload.id);
      if (!exists) {
        state.cities.push(action.payload);
        addCityToStorage(action.payload);
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter((city) => city.id !== action.payload);
      removeCityFromStorage(action.payload);
    },
  },
});

export const { initializeCities, addCity, removeCity } = citiesSlice.actions;
export default citiesSlice.reducer;
