import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.105:5000/api/', // replace with your PC IP
  }),

  tagTypes: ['User'],

  endpoints: () => ({}),
});