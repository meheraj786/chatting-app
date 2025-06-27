import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Setting from "./pages/Setting";
import Menubar from "./components/menubar/Menubar";

function App() {
  const router = createBrowserRouter([
    {
      path: "/registration",
      element: <Registration />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
    },
    {
      path: "/",
      element: <Menubar />,
      children: [
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "chat",
          element: <Chat />,
        },
        {
          path: "setting",
          element: <Setting />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
