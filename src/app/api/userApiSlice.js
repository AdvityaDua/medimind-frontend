import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://medimind-backend-ten.vercel.app/" // change this
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
    }),

    loginUser: builder.mutation({
      query: (credentials ) => ({
        url: "/users/login/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useLoginUserMutation } = api;
