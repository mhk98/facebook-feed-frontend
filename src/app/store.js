import { commentApi } from "../features/comment/comment";
import { postApi } from "../features/post/post";
import { replyApi } from "../features/reply/reply";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
  reducer: {
    [postApi.reducerPath]: postApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [replyApi.reducerPath]: replyApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      postApi.middleware,
      commentApi.middleware,
      replyApi.middleware
    ),
});

export default store;
