import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.REACT_APP_API_URL;

export const weatherApi = createApi({
    reducerPath: 'weatherApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/api/weather` }),
    endpoints: (builder) => ({
        getCurrentWeather: builder.query({
            query: (city) => `current?q=${city}`,
        }),
        getForecast: builder.query({
            query: ({ city, days = 7 }) => `forecast?q=${city}&days=${days}`,
        }),
        searchCities: builder.query({
            query: (searchTerm) => `search?q=${searchTerm}`,
        }),
    }),
});

// Export auto-generated hooks for use in components
export const {
    useGetCurrentWeatherQuery,
    useGetForecastQuery,
    useLazySearchCitiesQuery, // Use Lazy Query for on-demand fetching
} = weatherApi;