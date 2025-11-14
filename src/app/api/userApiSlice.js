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
            url: "users/refresh-token/",
            method: "POST",
        }),
    }),
    getUsers: builder.query({
      query: ( {currentPage=1, pageSize=10, searchTerm=''} = {}) => {
        const params = new URLSearchParams({
      page: currentPage,
      page_size: pageSize,
    });
    
    if (searchTerm && searchTerm.trim()) {
      params.append('name', searchTerm);
      console.log(searchTerm)
    }
    
    return {
      url: `users/?${params.toString()}`
    };
      }
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}/`,
        method: 'DELETE',
        body: id
      })
    }),
    addUser:builder.mutation({
      query: (data) => ({
        url: `users/`,
        method: 'POST',
        body: data
      })
    }),
    editUser: builder.mutation({
      query: ({id, updatedData}) => ({
        url: `users/${id}/`,
        method: 'PATCH',
        body: updatedData
      })
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshMutation, useLazyGetUsersQuery, useDeleteUserMutation, useAddUserMutation, useEditUserMutation } = userApiSlice;
