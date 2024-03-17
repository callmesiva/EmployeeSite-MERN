import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./Component/Home";
import Login from "./Component/Login";
import Signup from "./Component/Signup";
import { Provider } from "react-redux";
import Store from "./RTK/store";

const AppLayout = () => (
  <Provider store={Store}>
    <Outlet />
  </Provider>
);

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={AppRouter} />);
