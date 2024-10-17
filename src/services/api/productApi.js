import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../constants/apiConstants";

export const productApi = createApi({
  reducerPath: "productApi", // Match this with store setup
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    searchProduct: builder.query({
      query: (name) => ({
        url: `/api/product/searchData?name=${name}`,
        method: "GET",
      }),
    }),

    getProductCarousel: builder.query({
      query: () => ({
        url: "/api/product/getAllProduct",
        method: "GET",
      }),
    }),

    getRecommendedProducts: builder.query({
      query: (productId) => ({
        url: `/api/product/getRecommendProduct/${productId}`,
        method: "GET",
      }),
    }),

    getOneProduct: builder.query({
      query: (id) => ({
        url: `/api/product/getProductDetail/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSearchProductQuery,
  useGetProductCarouselQuery,
  useGetRecommendedProductsQuery,
  useGetOneProductQuery,
} = productApi;
