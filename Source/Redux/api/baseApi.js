// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const baseApi = createApi({
//   reducerPath: 'baseApi',

//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://10.0.2.2:5001/api/', // replace with your PC IP
//   }),

//   tagTypes: ['User'],

//   endpoints: () => ({}),
// });

import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',

  baseQuery: fetchBaseQuery({
    // baseUrl: 'http://192.168.20.21:5001/api/',
    // ipconfig getifaddr en0
    // Emulator: 10.0.2.2
    // Real Samsung A51: USB + adb reverse
    baseUrl: 'http://10.0.2.2:5001/api/',
  }),

  tagTypes: ['User'],

  endpoints: () => ({}),
});