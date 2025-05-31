import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/useApi";
import myToast from "@/lib/custom/toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { apiRoutes } from "@/api/apiRoutes";
import { RotateCcwKey, UserRoundPen } from "lucide-react";
import { resetPasswordSchema } from "@/lib/schema/formSchema";
import { Spinner } from "@/components/ui/spinner";

export default function ResetPasswordDialog() {
  const [open, setOpen] = useState(false);
  const { request, loading } = useApi();

  const {
    register,
    setFocus,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    const res = await request({
      method: "put",
      url: apiRoutes.user.profile.password.reset,
      data: data,
    });

    console.log(res);

    if (res?.success) {
      myToast("success", "Password updated successfully");
      setOpen(false);
    } else {
      if (res?.error?.code === "109") {
        myToast("warning", "Invalid old password");
        setFocus("oldPassword");
        setError("oldPassword", {
          type: "manual",
          message: "Please enter a valid password",
        });
        return;
      }
      myToast("error", res?.message || "Failed to update password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="" variant="outline" size={undefined}>
          <span>
            <RotateCcwKey />
          </span>
          <span>Reset Password</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-md max-w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="">
          <DialogTitle className="">Edit Profile</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-4 pt-2 pb-6"
        >
          <div className="space-y-2">
            <Label htmlFor="oldPassword" required className={undefined}>
              Old Password
            </Label>
            <Input
              className={undefined}
              type="text"
              id="oldPassword"
              {...register("oldPassword")}
              placeholder="Old Password"
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-xs">
                {errors.oldPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" required className={undefined}>
              New Password
            </Label>
            <Input
              className={undefined}
              type="password"
              id="newPassword"
              {...register("newPassword")}
              placeholder="New Password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required className={undefined}>
              Confirm Password
            </Label>
            <Input
              className={undefined}
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="mt-5">
            <Button className="w-full" variant={undefined} size={undefined}>
              {loading ? (
                <Spinner
                  size="xs"
                  show={undefined}
                  children={undefined}
                  className="text-card"
                />
              ) : (
                <span>Reset Password</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
