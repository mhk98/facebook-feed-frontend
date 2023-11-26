import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const replyApi = createApi({
  reducerPath: "replyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
    // baseUrl: "https://createabit-backend.onrender.com/api/v1/",
  }),

  tagTypes: ["replies"], // Define the tag type
  endpoints: (build) => ({
    createReply: build.mutation({
      query: (data) => ({
        url: "/reply/create-reply",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["replies"],
    }),

    deleteReply: build.mutation({
      query: (id) => ({
        url: `/reply/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["replies"],
    }),
    editReply: build.mutation({
      query: ({ id, data }) => ({
        url: `/reply/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["replies"],
    }),

    getAllReply: build.query({
      query: () => ({
        url: "/reply",
      }),
      providesTags: ["replies"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateReplyMutation,
  useDeleteReplyMutation,
  useEditReplyMutation,
  useGetAllReplyQuery,
} = replyApi;
