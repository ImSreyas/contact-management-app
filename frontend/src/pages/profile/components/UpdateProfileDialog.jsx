import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { UserRoundPen } from "lucide-react";
import { profileUpdateSchema } from "@/lib/schema/formSchema";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectDialog";
import DatePicker from "@/components/common/DatePicker";
// import { toFormData } from "@/lib/utils";
import { format } from "date-fns";

export default function UpdateProfileDialog({ onProfileUpdated }) {
  const [open, setOpen] = useState(false);
  const { request, loading } = useApi();
  const { request: updateRequest, loading: updateLoading } = useApi();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (open) {
      request({
        method: "get",
        url: apiRoutes.user.profile.get,
      }).then((res) => {
        if (res?.success && res.data) {
          const userData = res.data.user;
          const data = {
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            password: "",
            dob: userData.dob ? new Date(userData.dob) : new Date(),
            gender: userData.gender || "male",
            phoneNumbers: userData.phoneNumbers?.length
              ? userData.phoneNumbers
              : [""],
            address: userData.address || "",
          };
          reset(data);
        } else {
          myToast("error", res?.message || "Failed to fetch profile");
        }
      });
    }
  }, [open]);

  const onSubmit = async (data) => {
    // const formData = toFormData(data);
    data = {
      ...data,
      dob: format(data.dob, "yyyy-MM-dd"),
    };
    const res = await updateRequest({
      method: "put",
      url: apiRoutes.user.profile.update,
      data: data,
    });

    if (res?.success) {
      myToast("success", "Profile updated successfully");
      setOpen(false);
      onProfileUpdated?.();
    } else {
      myToast("error", res?.message || "Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="" variant="outline" size={undefined}>
          <span>
            <UserRoundPen />
          </span>
          <span>Edit Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="">
          <DialogTitle className="">Edit Profile</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner
              size="lg"
              show={undefined}
              children={undefined}
              className={undefined}
            />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 px-8 pt-4 pb-6"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firstName" required className={undefined}>
                  First Name
                </Label>
                <Input
                  className={undefined}
                  type="text"
                  id="firstName"
                  {...register("firstName")}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName" required className={undefined}>
                  Last Name
                </Label>
                <Input
                  className={undefined}
                  type="text"
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="email" required className={undefined}>
                  Email
                </Label>
                <Input
                  className={undefined}
                  type="email"
                  id="email"
                  {...register("email")}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label required className={undefined}>
                  Phone
                </Label>
                <Input
                  className={undefined}
                  type="text"
                  id="phone"
                  {...register("phone")}
                  placeholder="Phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className={undefined}>Date of Birth</Label>
                <DatePicker
                  state={[watch("dob"), (date) => setValue("dob", date)]}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs">{errors.dob.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="gender" required className={undefined}>
                  Gender
                </Label>
                <Select
                  onValueChange={(value) => setValue("gender", value)}
                  defaultValue={watch("gender")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className={undefined}>
                    <SelectItem value="male" className={undefined}>
                      Male
                    </SelectItem>
                    <SelectItem value="female" className={undefined}>
                      Female
                    </SelectItem>
                    <SelectItem value="other" className={undefined}>
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-xs">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address" required className={undefined}>
                Address
              </Label>
              <Textarea
                className={undefined}
                id="address"
                {...register("address")}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address.message}</p>
              )}
            </div>

            <DialogFooter className="w-full pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                variant={undefined}
                size={undefined}
              >
                {updateLoading ? (
                  <span>
                    <Spinner
                      size="xxs"
                      className="text-card"
                      show={undefined}
                      children={undefined}
                    />
                  </span>
                ) : (
                  <span>Update Profile</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
