import { z } from "zod";

// Constants for Regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const NAME_REGEX = /^[a-zA-Z\s]+(?:[a-zA-Z\s]+)*$/;

export const AuthSignInSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, "Invalid email format").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AuthSignInSchemaType = z.infer<typeof AuthSignInSchema>;

export const AuthSignUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .regex(
        NAME_REGEX,
        "Name cannot contain special characters or start/end with spaces"
      )
      .trim(),
    email: z.string().email("Invalid email format").trim(),
    password: z
      .string()
      .regex(
        PASSWORD_REGEX,
        "Password must have at least 8 characters with at least one uppercase, one lowercase, one number and one special character"
      )
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AuthSignUpSchemaType = z.infer<typeof AuthSignUpSchema>;

export type RegisterType = "signIn" | "signUp";
