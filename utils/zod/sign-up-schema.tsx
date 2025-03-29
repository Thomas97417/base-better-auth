import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "First name is required" })
      .max(20, { message: "First name is too long. Maximum 20 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(20, { message: "Last name is too long. Maximum 20 characters" }),
    email: z
      .string()
      .email({ message: "Invalid type" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password is too short. Minimum 8 characters" })
      .max(20, { message: "Password is too long. Maximum 20 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password must be at most 20 characters long" }),
    image: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
