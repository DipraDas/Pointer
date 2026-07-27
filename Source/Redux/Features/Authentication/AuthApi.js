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

  }),
});

export const {
  useSignupMutation,
  useVerifySignupOtpMutation,
  useLoginMutation,
  useVerifyLoginOtpMutation,
} = authApi;