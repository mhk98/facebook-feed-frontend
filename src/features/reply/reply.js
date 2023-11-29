import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const replyApi = createApi({
  reducerPath: "replyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://facebook-feed.onrender.com/api/v1/",
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
      query: ({ postId, commentId, replyId }) => ({
        url: `/reply/${postId}/${commentId}/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["replies"],
    }),
    editReply: build.mutation({
      query: ({ content, postId, commentId, replyId }) => ({
        url: `/reply/${postId}/${commentId}/${replyId}`,
        method: "PUT",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
        },
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
