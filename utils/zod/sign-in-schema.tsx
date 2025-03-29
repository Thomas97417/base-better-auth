import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string() // string type
    .email({ message: "Invalid type" }) // checks if the input given by the user is email
    .min(1, { message: "Email is required" }), // checks if the email field is empty or not
  password: z
    .string() // string type
    .min(8, { message: "Password is too short. Minimum 8 characters" })
    .max(20, { message: "Password is too long. Maximum 20 characters" }),
});
