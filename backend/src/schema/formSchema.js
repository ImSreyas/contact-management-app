import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2).max(30),
    lastName: z.string().min(2).max(30),
    email: z.string().email(),
    phone: z
      .string()
      .min(10, "Phone number is too short")
      .max(15, "Phone number is too long")
      .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    dob: z.string().date().optional(),
    gender: z
      .enum(["male", "female", "other"], {
        required_error: "Gender is required",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  phoneNumbers: z
    .array(
      z
        .string()
        .min(10, "Phone number is too short")
        .max(15, "Phone number is too long")
        .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format")
    )
    .min(1, "At least one phone number is required"),
});
