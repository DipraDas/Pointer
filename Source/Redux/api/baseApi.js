import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const baseApi = createApi({
  reducerPath: 'baseApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.105:5000/api',

    prepareHeaders: async headers => {
      const accessToken =
        await AsyncStorage.getItem('accessToken');

      console.log(
        'Authorization token:',
        accessToken
          ? 'FOUND'
          : 'NOT FOUND',
      );

      if (accessToken) {
        headers.set(
          'Authorization',
          `Bearer ${accessToken}`,
        );
      }

      return headers;
    },
  }),

  tagTypes: ['User'],

  endpoints: () => ({}),
});