import { apiRoutes } from "@/api/apiRoutes";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useApi } from "@/hooks/useApi";
import myToast from "@/lib/custom/toast";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import {
  ArrowUpRight,
  ExternalLink,
  Link,
  Share,
  UserRound,
} from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";

export default function ProfilePopup() {
  const { user, setUser } = useProfileStore();
  const { request, loading } = useApi();
  const { logout } = useAuthStore();

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

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "w-9 h-9 border-dashed border border-primary bg-input hover:bg-background flex justify-center items-center overflow-hidden",
              user?.profilePicture && "bg-card border-solid border-primary/25",
            )}
          >
            {loading ? (
              <Spinner
                size="xxs"
                show={undefined}
                children={undefined}
                className={undefined}
              />
            ) : (
              <img
                src={
                  // @ts-ignore
                  import.meta.env.VITE_BASE_URL + user?.profilePicture
                }
                className="object-cover w-full h-full"
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="shadow-none min-w-sm max-w-[90vw] rounded-2xl py-6 px-6 border-primary/25 backdrop-blur-md bg-background/50"
          sideOffset={10}
          side="bottom"
          align="end"
        >
          <div className="grid gap-5">
            <div className="w-full h-fit border-input border rounded-lg relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="/profile" className="absolute top-4 right-4 w-fit">
                    <ExternalLink size={18} className="text-primary" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className={undefined}>
                  <p>User Profile</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex flex-col justify-center items-center px-4 pt-6 pb-7">
                <div className="w-20 h-20 rounded-[1.4rem] overflow-hidden border-1 border-dashed border-primary mb-2">
                  {user?.profilePicture ? (
                    <img
                      src={
                        // @ts-ignore
                        import.meta.env.VITE_BASE_URL + user?.profilePicture
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-input flex justify-center items-center">
                      <UserRound className="text-primary" size={18} />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                {loading && <LoadingSkelton />}
              </div>
            </div>
            <div className="w-full h-fit">
              <Button
                className="border-input border rounded-md text-foreground w-full hover:bg-transparent hover:border-dashed hover:border-2 bg-transparent"
                size={undefined}
                variant="default"
                onClick={handleLogout}
              >
                LogOut
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function LoadingSkelton() {
  return (
    <div className="flex flex-col py justify-center items-center gap-2 py-2">
      <Skeleton className="h-4 w-40 bg-input" />
      <Skeleton className="h-4 w-32 bg-input" />
    </div>
  );
}
