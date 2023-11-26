import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
    // baseUrl: "https://createabit-backend.onrender.com/api/v1/",
  }),

  tagTypes: ["posts"], // Define the tag type
  endpoints: (build) => ({
    createPost: build.mutation({
      query: (formData) => ({
        url: "/post/create-post",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["posts"],
    }),

    deletePost: build.mutation({
      query: (id) => ({
        url: `/post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["post"],
    }),
    editPost: build.mutation({
      query: ({id, data}) => ({
        url: `/post/${id}`,
        method: "PUT",
        body: data,

      }),
      invalidatesTags: ["post"],
    }),

    getAllPost: build.query({
      query: () => ({
        url: "/post",
      }),
      providesTags: ["posts"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetAllPostQuery,
  useDeletePostMutation,
  useEditPostMutation,
} = postApi;
