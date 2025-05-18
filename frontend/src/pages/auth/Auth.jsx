import React from "react";
import { House } from "lucide-react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = location.pathname === "/login" ? "login" : "signup";

  const handleTabChange = (value) => {
    navigate(value === "login" ? "/login" : "/signup");
  };

  return (
    <div className="h-[100dvh] grid grid-cols-3">
      <a
        href="/"
        className="z-10 bg-background fixed top-6 left-6 p-3 rounded-2xl border border-muted"
      >
        <House size={20} />
      </a>

      {/* First Section: Full Image */}
      <div className="relative w-full h-full col-span-2">
        <img
          alt="Background"
          src="/tv1.png"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </div>

      {/* Second Section: Login Form */}
      <div className="h-[100dvh] overflow-y-scroll">
        <Tabs
          defaultValue="login"
          value={currentTab}
          onValueChange={handleTabChange}
        >
          <div className="w-full flex justify-center items-center pt-8 pb-6 sticky -top-2 bg-background z-10">
            <TabsList type="retro">
              <TabsTrigger value="login" className="w-full" type="retro">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="w-full">
                Sign Up
              </TabsTrigger>
            </TabsList>
          </div>
          <div>
            <TabsContent value="login" className="w-full flex justify-center items-center min-h-[75dvh]">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="w-full flex justify-center items-center">
              <SignupForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
