import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/pages/home/Home";
import Contacts from "@/pages/contacts/Contacts";
import Profile from "@/pages/profile/Profile";
import NotFound from "@/pages/not-found/NotFound";
import Layout from "@/Layout";
import Auth from "@/pages/auth/Auth";
import { Toaster } from "sonner";

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
