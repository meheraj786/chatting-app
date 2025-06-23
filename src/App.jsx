import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Registration from "./pages/Registration";
import Login from "./pages/Login";


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
]);
  

  return (
<>
<RouterProvider router={router} />
</>
  );
}

export default App;
