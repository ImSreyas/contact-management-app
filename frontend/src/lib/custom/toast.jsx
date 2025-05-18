import { toast } from "sonner";
import React from "react";
import { CircleCheck, AlertTriangle, Info, X, ShieldAlert } from "lucide-react";

const iconMap = {
  success: <CircleCheck className="text-green-600 w-5 h-5" />,
  error: <ShieldAlert className="text-red-500 w-5 h-5" />,
  info: <Info className="text-blue-500 w-5 h-5" />,
  warning: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
};

export default function myToast(type = "success", message = "") {
  const icon = iconMap[type] ?? null;

  toast.custom((t) => (
    <div
      className="w-sm max-w-[90vw] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 shadow-lg flex items-center gap-3 relative pr-10"
      role="alert"
    >
      <div>{icon}</div>
      <div className="w-[calc(100%-2rem)]">
        <div className="text-sm text-zinc-900 dark:text-white font-medium truncate whitespace-nowrap overflow-hidden w-full">
          {message}
        </div>
      </div>
      <button
        className="absolute top-2.5 right-2.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
        onClick={() => toast.dismiss(t)}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ));
}
