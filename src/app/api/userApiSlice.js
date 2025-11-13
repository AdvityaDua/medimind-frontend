import { apiSlice } from './index';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "users/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "users/logout/",
        method: "POST",
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "users/refresh/",
        method: "POST",
      }),
    }),
  }),
});


export const { useLoginMutation, useLogoutMutation, useRefreshMutation } = userApiSlice;