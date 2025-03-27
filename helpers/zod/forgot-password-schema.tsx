import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z
    .string() // string type
    .email({ message: "Invalid type" }) // checks if the input given by the user is email
    .min(1, { message: "Email is required" }), // checks if the email field is empty or not
});
