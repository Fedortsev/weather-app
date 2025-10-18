import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { weatherApi } from '@/store/weatherApi';
import citiesReducer from '@/store/citiesSlice';

/**
 * @returns
 */
export const createMockStore = (): EnhancedStore => {
  return configureStore({
    reducer: {
      weatherApi: weatherApi.reducer,
      cities: citiesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(weatherApi.middleware),
  });
};

/**
 * @param preloadedState
 * @returns
 */
export const createMockStoreWithState = (preloadedState?: unknown): EnhancedStore => {
  return configureStore({
    reducer: {
      weatherApi: weatherApi.reducer,
      cities: citiesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(weatherApi.middleware),
    preloadedState,
  });
};
