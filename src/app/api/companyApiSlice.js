import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://medimin-backend.vercel.app/",
  }),

  endpoints: (builder) => ({
    // 🔹 Get company products
    getProducts: builder.query({
      query: () => "company/products",
    }),

    // 🔹 Get connected suppliers
    getSuppliers: builder.query({
      query: () => "company/suppliers",
    }),

    // 🔹 Get alert notifications
    getAlerts: builder.query({
      query: () => "company/alerts",
    }),

    // 🔹 AI model insight API (LLM call)
    getAiInsights: builder.mutation({
      query: (prompt) => ({
        url: "company/ai-insights",
        method: "POST",
        body: { prompt },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSuppliersQuery,
  useGetAlertsQuery,
  useGetAiInsightsMutation
} = companyApi;
