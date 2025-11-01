import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { weatherApi } from '../services/weatherApi';
import settingsReducer from './settingsSlice';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        settings: settingsReducer,
        auth: authReducer,
        [weatherApi.reducerPath]: weatherApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(weatherApi.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);