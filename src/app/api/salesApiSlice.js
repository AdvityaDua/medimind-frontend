import { apiSlice } from "./index";

export const salesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query({
      query: () => `/sales/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Sale", id })),
              { type: "Sale", id: "LIST" },
            ]
          : [{ type: "Sale", id: "LIST" }],
    }),
    createSale: builder.mutation({
      query: (saleData) => {
        if (saleData.input_type === "manual") {
          // Manual entry, send as JSON
          return {
            url: `/sales/`,
            method: "POST",
            body: saleData,
            headers: {
              "Content-Type": "application/json",
            },
          };
        } else {
          // File upload (pdf/excel), send as FormData
          const formData = new FormData();
          formData.append("input_type", saleData.input_type);
          formData.append("file", saleData.file);
          return {
            url: `/sales/`,
            method: "POST",
            body: formData,
          };
        }
      },
      invalidatesTags: [{ type: "Sale", id: "LIST" }],
    }),
  }),
});

export const { useGetSalesQuery, useCreateSaleMutation } = salesApiSlice;
