import { apiSlice } from "./index";

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query({
      query: () => `/inventory/`,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Inventory", id })),
              { type: "Inventory", id: "LIST" },
            ]
          : [{ type: "Inventory", id: "LIST" }],
    }),
    createInventory: builder.mutation({
      query: (data) => ({
        url: `/inventory/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Inventory", id: "LIST" }],
    }),
    updateInventory: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/inventory/${id}/`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{
        type: "Inventory",
        id
      }],
    }),
    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `/inventory/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{
        type: "Inventory",
        id
      }],
    }),
    getMedicines: builder.query({
      query: () => `/medicine/`,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Medicine", id })),
              { type: "Medicine", id: "LIST" },
            ]
          : [{ type: "Medicine", id: "LIST" }],
    }),
    createMedicine: builder.mutation({
      query: (data) => ({
        url: `/medicine/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Medicine", id: "LIST" }, { type: "Inventory", id: "LIST" }],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
  useGetMedicinesQuery,
  useCreateMedicineMutation,
} = inventoryApiSlice;
