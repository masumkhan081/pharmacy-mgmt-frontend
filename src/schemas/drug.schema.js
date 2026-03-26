import { z } from "zod";

// Generic Schema
export const genericSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  groupId: z.string().optional(),
});

// Brand Schema
export const brandSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
});

// Group Schema
export const groupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
});

// Formulation Schema
export const formulationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
});

// Manufacturer Schema
export const mfrSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  country: z.string().optional(),
  contactInfo: z.string().optional(),
});

// Drug Schema
export const drugSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  genericId: z.string().min(1, { message: "Generic is required" }),
  brandId: z.string().optional(),
  mfrId: z.string().optional(),
  formulationId: z.string().optional(),
  unitId: z.string().optional(),
  strength: z.string().optional(),
  description: z.string().optional(),
});
