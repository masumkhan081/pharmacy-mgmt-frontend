import { z } from "zod";

// All schemas aligned to BE Prisma contracts (b/src/schemas/*.ts).

export const genericSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  description: z.string().max(500).optional().or(z.literal("")),
});

export const brandSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  origin: z.string().max(100).optional().or(z.literal("")),
});

export const groupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  description: z.string().max(500).optional().or(z.literal("")),
});

export const formulationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
});

export const mfrSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  address: z.string().max(255).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
});

// BE service maps short keys -> Prisma columns (brand->brandId, etc.) and
// derives `name` from Brand + Strength + Unit, so the FE form provides the short keys.
export const drugSchema = z.object({
  brand: z.string().min(1, { message: "Brand is required" }),
  formulation: z.string().min(1, { message: "Formulation is required" }),
  strength: z.number().min(0, { message: "Strength cannot be negative" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  mrp: z.number().min(0, { message: "MRP cannot be negative" }),
  purchasePrice: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
