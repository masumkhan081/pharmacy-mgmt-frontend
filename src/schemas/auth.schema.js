import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be no more than 20 characters" }),
});

// Register Schema
export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .nonempty({ message: "Email is required" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .nonempty({ message: "Password is required" }),

  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(50, { message: "Full name must be at most 50 characters long" }),

  phone: z.string().nonempty({ message: "Phone number is required" }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  address: z.string().optional(),
});

// OTP Verification Schema
export const otpVerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  token: z.string().min(15).max(500),
  otp: z.string().min(4).max(6),
});

// Email Schema
export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

// Reset Password Schema
export const resetPassSchema = z.object({
  token: z.string().min(15).max(500),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be no more than 20 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm password must be at least 6 characters long" })
    .max(20, { message: "Confirm password must be no more than 20 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
