import { baseApi } from '../../api/baseApi';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      queryFn: async (data, _queryApi, _extraOptions, baseQuery) => {
        try {
          const accessToken = await AsyncStorage.getItem("accessToken");

          const result = await baseQuery({
            url: "users/change-password",
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          return result;

        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error?.message || "Something went wrong",
            },
          };
        }
      },
    }),

  }),
});

export const {
  useSignupMutation,
  useVerifySignupOtpMutation,
  useLoginMutation,
  useVerifyLoginOtpMutation,
  useChangePasswordMutation
} = authApi;