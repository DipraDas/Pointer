import { baseApi } from '../../api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({

    signup: builder.mutation({
      query: body => ({
        url: 'users/signup',
        method: 'POST',
        body,
      }),
    }),

    verifySignupOtp: builder.mutation({
      query: body => ({
        url: 'users/verify-signup-otp',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation({
      query: body => ({
        url: 'users/login',
        method: 'POST',
        body,
      }),
    }),

    verifyLoginOtp: builder.mutation({
      query: body => ({
        url: 'users/verify-login-otp',
        method: 'POST',
        body,
      }),
    }),

    changePassword: builder.mutation({
      query: data => ({
        url: 'users/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    saveDeviceToken: builder.mutation({
      query: data => ({
        url: 'users/device-token',
        method: 'POST',
        body: data,
      }),
    }),

    getAllDevices: builder.query({
      query: () => ({
        url: "devices",
        method: "GET",
      }),

      providesTags: ["Device"],
    }),

    addDeviceToUser: builder.mutation({
      query: ({ email, serialNumber }) => ({
        url: 'users/add-device',
        method: 'POST',
        body: {
          email,
          serialNumber,
        },
      }),
      invalidatesTags: ["User", "Device"],
    }),
    // =========================
    // GET CURRENT USER
    // =========================

    getCurrentUser: builder.query({

      query: () => ({
        url: 'users/me',
        method: 'GET',
      }),

      providesTags: ['User'],

    }),


    // =========================
    // GET LATEST DEVICE DATA
    // =========================

    getLatestDeviceData: builder.query({

      query: serialNumber => ({
        url: `tracker/latest/${serialNumber}`,
        method: 'GET',
      }),

    }),
  }),
});

export const {
  useSignupMutation,
  useVerifySignupOtpMutation,
  useLoginMutation,
  useVerifyLoginOtpMutation,
  useChangePasswordMutation,
  useSaveDeviceTokenMutation,
  useGetAllDevicesQuery,
  useAddDeviceToUserMutation,
  useGetCurrentUserQuery,
  useGetLatestDeviceDataQuery,
} = authApi;