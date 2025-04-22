import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Template from "../layouts/template";
import Dashboard from "../pages/Dashboard";
import PrivatePage from "../pages/middleware/PrivatePage";
import PublicPage from "../pages/middleware/PublicPage";
import StuffIndex from "../pages/stuff/Index";
import InboundIndex from "../pages/stuff/inbound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      { 
        index: true, 
        element: <App /> 
      },
      { 
        path: "login", 
        element: <PublicPage />,
        children: [
          { index: true, element: <Login /> }
        ]
      },
      {
        element: <PrivatePage />,
        children: [
          { 
            path: "profile", 
            element: <Profile /> 
          },
          { 
            path: "dashboard", 
            element: <Dashboard /> 
          },
          {
            path: "stuff",
            element: <StuffIndex />
          },
          {
            path: "inbound-stuff",
            element: <InboundIndex />
          }
        ]
      }
    ]
  }
]);
