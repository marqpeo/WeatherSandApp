import { configureStore } from '@reduxjs/toolkit';
import cities from './citiesState';

export const store = configureStore({
  reducer: {
    cities,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
