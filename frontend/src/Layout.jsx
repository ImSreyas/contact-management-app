import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "@/components/Nav";
import { navHiddenRoutes, publicRoutes } from "./lib/const/routeContants";
import AuthGuard from "./components/common/AuthGuard";

export default function Layout() {
  const path = useLocation();
  const isHidden = navHiddenRoutes.includes(path.pathname);
  const isPrivateRoute = !publicRoutes.includes(path.pathname);

  return (
    <main>
      {!isHidden && <Nav />}
      <div>
        {isPrivateRoute ? (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ) : (
          <Outlet />
        )}
      </div>
    </main>
  );
}
