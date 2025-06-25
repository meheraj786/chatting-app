import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from './pages/Home'


function App() {
  const router = createBrowserRouter([
  {
    path: "/registration",
    element: <Registration/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword/>,
  },
  {
    path: "/home",
    element: <Home/>,
  },
]);
  

  return (
<>
<RouterProvider router={router} />
</>
  );
}

export default App;
