import { configureStore } from '@reduxjs/toolkit';
import { weatherApi } from './weatherApi';
import citiesReducer from './citiesSlice';

export const store = configureStore({
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer,
    cities: citiesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(weatherApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
