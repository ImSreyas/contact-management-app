import { apiRoutes } from "@/api/apiRoutes";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/useApi";
import myToast from "@/lib/custom/toast";
import { Pen, UserRound } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import UpdateProfileDialog from "./components/UpdateProfileDialog";
import { UpdateProfilePictureDialog } from "./components/UpdateProfilePictureDialog";
import { useCallback } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import ResetPasswordDialog from "./components/ResetPasswordDialog";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user, setUser } = useProfileStore();
  const { request, loading } = useApi();
  const getProfileData = async () => {
    const response = await request({ url: apiRoutes.user.profile.get });
    if (response.success) {
      setUser(response?.data?.user);
    } else {
      myToast("error", "Failed to fetch user profile");
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const onProfilePictureUpdate = useCallback(() => {
    getProfileData();
  }, [getProfileData]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex items-center justify-center py-6 ">
      <div
        className={cn(
          "w-full max-w-[90vw] sm:max-w-[70vw] bg-background rounded-2xl border p-8 flex flex-col items-center relative pt-22 xl:pt-8",
        )}
      >
        {/* Profile Picture */}
        <div className="relative w-fit h-fit">
          <div className="w-28 h-28 rounded-full overflow-hidden border-1 border-dashed border-primary mb-4">
            {user?.profilePicture ? (
              <img
                // @ts-ignore
                src={import.meta.env.VITE_BASE_URL + user?.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-input flex justify-center items-center">
                <UserRound className="text-primary" />
              </div>
            )}
            <UpdateProfilePictureDialog onAction={onProfilePictureUpdate} />
          </div>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {user?.firstName} {user?.lastName}
        </h2>
        {/* Email */}
        <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
        {/* Info Card */}
        <div className="w-full space-y-3">
          <InfoRow
            label="Date of Birth"
            value={new Date(user?.dob).toLocaleDateString()}
          />
          <InfoRow label="Gender" value={user?.gender} />
          <InfoRow label="Address" value={user?.address} />
          <InfoRow label="Phone Numbers" value={user?.phone} />
        </div>
        {/* Edit Button (shadcn/ui Button) */}
        <div className="absolute top-6 right-0 flex gap-2 items-center w-full justify-center xl:justify-end px-6">
          <UpdateProfileDialog onProfileUpdated={getProfileData} />
          <ResetPasswordDialog />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
      <span className="text-gray-600 font-medium">{label}</span>
      <pre className="text-gray-900 text-right">{value}</pre>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="w-full max-w-[90vw] sm:max-w-[70vw] bg-background rounded-2xl border p-8 flex flex-col items-center relative">
        <Skeleton className="w-28 h-28 rounded-full mb-4" />
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="w-full space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-56" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <Skeleton className="absolute top-6 right-6 h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}
