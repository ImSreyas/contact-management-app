"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DatePicker from "@/components/common/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { signupSchema } from "@/lib/schema/formSchema";
import { useApi } from "@/hooks/useApi";
import { toFormData } from "@/lib/utils";
import { apiRoutes } from "@/api/apiRoutes";
import myToast from "../../../lib/custom/toast";
import { useEffect } from "react";
import { useRef } from "react";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setFocus,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const { request, loading, error: apiError } = useApi();
  const profilePicRef = useRef(null);

  useEffect(() => {
    if (apiError?.code === "101") {
      setFocus("email");
    }
  }, [apiError, setFocus]);

  const onSubmit = async (data) => {
    const formData = toFormData(data);
    const res = await request({
      method: "post",
      url: apiRoutes.auth.signup,
      data: formData,
    });
    if (res.success) {
      myToast("success", "Signup successful");
    } else {
      // todo: Handle the 100 error of form field validation error
      if (res?.error.code === "101") {
        myToast("error", res.error.error || "Something went wrong");
      } else {
        myToast("error", res.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-background w-[90vw] sm:w-md rounded-xl px-12 sm:px-12 pb-16 pt-2">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight py-1">Sign Up</h2>
          <p className="text-sm text-muted-foreground">Create your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Sreyas"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Satheesh"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="text"
              placeholder="demo@example.com"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            ) : (
              apiError.code === "101" && (
                <p className="text-red-500 text-sm">{apiError.error}</p>
              )
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="1234567890"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dob" optional>
              Date of Birth
            </Label>
            <DatePicker
              state={[watch("dob"), (date) => setValue("dob", date)]}
            />
            {errors.dob && (
              <p className="text-red-500 text-sm">{errors.dob.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gender" optional>
              Gender
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("gender", value, { shouldValidate: true })
              }
              defaultValue=""
              value={watch("gender") || ""}
            >
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address" optional>
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="Your Address"
              rows={3}
              {...register("address")}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profilePicture" optional>
              Profile Picture
            </Label>
            <Input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={(e) => setValue("profilePicture", e.target.files[0])}
              ref={profilePicRef}
            />
            {errors.profilePicture && (
              <p className="text-red-500 text-sm">
                {errors.profilePicture.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="******"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Spinner className="text-primary-foreground" size="xs" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          By signing up, you agree to our{" "}
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
