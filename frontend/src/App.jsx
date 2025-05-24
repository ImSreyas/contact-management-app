import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/pages/home/Home";
import Contacts from "@/pages/contacts/Contacts";
import Profile from "@/pages/profile/Profile";
import NotFound from "@/pages/not-found/NotFound";
import Layout from "@/Layout";
import { Toaster } from "sonner";
import Settings from "@/pages/settings/Settings";
import Auth from "@/pages/auth/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "login",
        element: <Auth />,
      },
      {
        path: "signup",
        element: <Auth />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster position="top-center" duration={5000} />
    </div>
  );
}
