import React from "react";
import { Provider } from "react-redux";
import store from "./app/store";
import { Route, Routes } from "react-router-dom";
import PostCreation from "./Components/PostCreation/PostCreation";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import RequireAuth from "./Components/Auth/RequireAuth";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <PostCreation />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Provider>
      <Toaster />
    </div>
  );
};

export default App;
