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
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/useApi";
import myToast from "@/lib/custom/toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { apiRoutes } from "@/api/apiRoutes";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Pencil, UserRoundPen } from "lucide-react";
import { contactSchema } from "@/lib/schema/formSchema";
import { Spinner } from "@/components/ui/spinner";

export default function UpdateContact({ contactId, onContactUpdated }) {
  const [open, setOpen] = useState(false);
  const { request, loading } = useApi();
  const [fetching, setFetching] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      location: "",
      company: "",
      phoneNumbers: [""],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    // @ts-ignore
    name: "phoneNumbers",
  });

  useEffect(() => {
    if (open && contactId) {
      setFetching(true);
      request({
        method: "get",
        url: apiRoutes.user.contacts.getOne(contactId),
      }).then((res) => {
        if (res?.success && res.data) {
          const data = {
            ...res?.data?.contact,
            phoneNumbers: res?.data?.contact?.phoneNumbers?.length
              ? res.data.contact.phoneNumbers
              : [""],
          };
          reset(data);
          replace(data.phoneNumbers);
        } else {
          myToast("error", res?.message || "Failed to fetch contact");
        }
        setFetching(false);
      });
    }
  }, [open, contactId]);

  const onSubmit = async (data) => {
    const res = await request({
      method: "put",
      url: apiRoutes.user.contacts.update(contactId),
      data,
    });
    if (res?.success) {
      myToast("success", "Contact updated successfully");
      setOpen(false);
      onContactUpdated?.();
    } else {
      myToast("error", res?.message || "Failed to update contact");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="w-6 h-6 p-4">
          <UserRoundPen />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-4xl min-w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Edit Contact</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {fetching ? (
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
            <div className="space-y-1 w-1/2">
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="location" required className={undefined}>
                  Location
                </Label>
                <Input
                  className={undefined}
                  type="text"
                  id="location"
                  {...register("location")}
                  placeholder="Your location"
                />
                {errors.location && (
                  <p className="text-red-500 text-xs">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="company" required className={undefined}>
                  Company
                </Label>
                <Input
                  className={undefined}
                  type="text"
                  id="company"
                  {...register("company")}
                  placeholder="Your company name"
                />
                {errors.company && (
                  <p className="text-red-500 text-xs">
                    {errors.company.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <Label required className={undefined}>
                Phone Numbers
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {fields.map((field, idx) => (
                  <div className="space-y-1" key={field.id}>
                    <div className="flex gap-2 items-center">
                      <Input
                        className={undefined}
                        type="phone"
                        {...register(`phoneNumbers.${idx}`)}
                        placeholder={`Phone ${idx + 1}`}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(idx)}
                          className={undefined}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                    {errors.phoneNumbers &&
                      Array.isArray(errors.phoneNumbers) &&
                      errors.phoneNumbers[idx]?.message && (
                        <p className="text-red-500 text-xs">
                          {errors.phoneNumbers[idx]?.message}
                        </p>
                      )}
                  </div>
                ))}
                {watch("phoneNumbers")?.every((item) => item?.trim() != "") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append("")}
                    className="w-full !px-4 flex gap-2 items-center h-[2.2rem] border-dashed border-2"
                  >
                    <span>Add Phone</span>
                    <Plus />
                  </Button>
                )}
              </div>
            </div>
            <DialogFooter className="w-full pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                variant={undefined}
                size={undefined}
              >
                {loading ? (
                  <span>
                    <Spinner
                      size="xs"
                      className="text-card"
                      show={undefined}
                      children={undefined}
                    />
                  </span>
                ) : (
                  <span>Update Contact</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
