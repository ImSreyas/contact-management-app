import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "@/components/nav/Nav";
import { navHiddenRoutes, publicRoutes } from "./lib/const/routeContants";
import AuthGuard from "./components/common/AuthGuard";

export default function Layout() {
  const path = useLocation();
  const isHidden = navHiddenRoutes.includes(path.pathname);
  const isPrivateRoute = !publicRoutes.includes(path.pathname);

  return (
    <main className="relative">
      {!isHidden && <Nav />}
      <div>
        {isPrivateRoute ? (
          <AuthGuard>
            <div className="px-8 md:px-20 py-8">
              <Outlet />
            </div>
          </AuthGuard>
        ) : (
          <Outlet />
        )}
      </div>
      {/* <div className="fixed inset-0 -z-10 break-words text-green-700 text-2xl font-normal tracking-[0.4rem] leading-20">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 transform w-screen h-screen bg-no-repeat bg-center bg-cover blur-xl opacity-30"
          style={{ backgroundImage: "url('/blob/3.svg')" }}
        />
      </div> */}
    </main>
  );
}
