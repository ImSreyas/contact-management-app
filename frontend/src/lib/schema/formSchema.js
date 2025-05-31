import * as z from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number is too short")
      .max(15, "Phone number is too long")
      .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
    address: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    dob: z.date().optional(),
    gender: z
      .enum(["male", "female", "other"], {
        required_error: "Gender is required",
      })
      .optional(),
    profilePicture: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  dob: z.date().optional(),
  gender: z
    .enum(["male", "female", "other"], {
      required_error: "Gender is required",
    })
    .optional(),
  phone: z
    .string()
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
  address: z.string().optional(),
});

export const resetPasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Password must me atleast 6 characters long"),
    newPassword: z
      .string()
      .min(6, "Password must me atleast 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must me atleast 6 characters long"),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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
        .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
    )
    .min(1, "At least one phone number is required"),
});
