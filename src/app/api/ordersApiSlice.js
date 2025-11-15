import { apiSlice } from "./index";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => `/orders/`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Order", id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    createOrder: builder.mutation({
      query: ({ input_type, formData }) => {
        let bodyContent;
        let headers = {};

        if (input_type === "manual") {
          bodyContent = formData;
          headers["Content-Type"] = "application/json";
        } else {
          bodyContent = formData;
        }

        return {
          url: `/orders/`,
          method: "POST",
          body: bodyContent,
          headers: headers,
        };
      },
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
  }),
});

export const { useGetOrdersQuery, useCreateOrderMutation } = ordersApiSlice;
