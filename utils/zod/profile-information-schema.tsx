import { z } from "zod";

export const ProfileInformationSchema = z.object({
  fullName: z
    .string() // string type
    .min(1, { message: "Name is required" }) // checks if the name field is empty or not
    .max(20, { message: "Name is too long. Maximum 20 characters" }),
  email: z
    .string() // string type
    .email({ message: "Invalid type" }) // checks if the input given by the user is email
    .min(1, { message: "Email is required" }), // checks if the email field is empty or not
  image: z.string().optional(),
});
