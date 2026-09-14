import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const baseApi = createApi({
  reducerPath: 'baseApi',

  baseQuery: fetchBaseQuery({
   baseUrl: "http://192.168.20.30:5001/api/",
// baseUrl: "http://192.168.20.20:5001/api/",

    prepareHeaders: async headers => {
      const accessToken =
        await AsyncStorage.getItem('accessToken');

      if (accessToken) {
        headers.set(
          'Authorization',
          `Bearer ${accessToken}`,
        );
      }

      return headers;
    },
  }),

  tagTypes: ['User', 'Device'],

  endpoints: () => ({}),
});