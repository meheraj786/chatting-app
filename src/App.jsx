import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";


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
]);
  

  return (
<>
<RouterProvider router={router} />
</>
  );
}

export default App;
