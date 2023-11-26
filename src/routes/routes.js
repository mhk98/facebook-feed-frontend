import { createBrowserRouter } from "react-router-dom";

import PostCreation from "../Components/PostCreation/PostCreation";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <PostCreation />,
    children: [
      {
        path: "/",
        element: <PostCreation />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  //   {
  //     path: "/dashboard",
  //     element: <Dashboard />,
  //     children: [
  //       {
  //         path: "/dashboard",
  //         element: <ProductList />,
  //       },
  //       {
  //         path: "add-product",
  //         element: <AddProduct />,
  //       },
  //     ],
  //   },
]);

export default routes;
