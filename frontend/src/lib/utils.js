import { clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function toFormData(data) {
  const formData = new FormData();

  for (const key in data) {
    const value = data[key];
    if (value instanceof Date) {
      formData.append(key, format(value, "yyyy-MM-dd"));
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  }

  return formData;
}
