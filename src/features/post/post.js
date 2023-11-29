import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://facebook-feed.onrender.com/api/v1/",
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
      invalidatesTags: ["posts"],
    }),
    editPostData: build.mutation({
      query: ({ id, data }) => ({
        url: `/post/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["posts"],
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
  useEditPostDataMutation,
} = postApi;
