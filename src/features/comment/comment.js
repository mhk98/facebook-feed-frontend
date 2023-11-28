import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
    // baseUrl: "https://createabit-backend.onrender.com/api/v1/",
  }),

  tagTypes: ["comments"], // Define the tag type
  endpoints: (build) => ({
    createComment: build.mutation({
      query: (data) => ({
        url: "/comment/create-comment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["comments"],
    }),

    deleteComment: build.mutation({
      query: ({ postId, commentId }) => ({
        url: `/comment/${postId}/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["comments"],
    }),
    editComment: build.mutation({
      query: ({ content, postId, commentId }) => ({
        url: `/comment/${postId}/${commentId}`,
        method: "PUT",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["comments"],
    }),

    getAllComment: build.query({
      query: () => ({
        url: `/comment`,
      }),
      providesTags: ["comments"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetAllCommentQuery,
} = commentApi;
