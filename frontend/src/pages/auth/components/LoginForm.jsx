"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useApi } from "@/hooks/useApi";
import { apiRoutes } from "@/api/apiRoutes";
import myToast from "@/lib/custom/toast";
import { loginSchema } from "@/lib/schema/formSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { request, loading, error: loginError } = useApi();
  const { isLoggedIn, login, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      logout();
    }
  }, []);

  const onSubmit = async (data) => {
    const response = await request({
      method: "post",
      url: apiRoutes.auth.login,
      data,
    });
    if (response?.success) {
      myToast("success", "Login successful");
      if (response?.data?.user) {
        login(response.data.user);
        navigate("/contacts");
      }
    } else {
      // It's for Focusing on the field based on the error code
      const focusOn = {
        201: "email",
        244: "password",
      };

      const code = response?.error?.code;
      if (code) setFocus(focusOn[code] || "email");
    }
  };

  return (
    <div className="flex items-center justify-center bg-background w-[90vw] sm:w-md rounded-xl px-12 sm:px-16 pb-16 pt-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight py-1">Login</h2>
          <p className="text-sm text-muted-foreground">
            Please sign in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="demo@example.com"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            ) : (
              loginError?.code === "201" && (
                <p className="text-red-500 text-sm">{loginError.error}</p>
              )
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="/forgot-password"
                className="text-xs underline px-2 text-primary"
              >
                Forgot password
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="******"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            ) : (
              loginError?.code === "244" && (
                <p className="text-red-500 text-sm">{loginError.error}</p>
              )
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Spinner className="text-primary-foreground" size="xs" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
