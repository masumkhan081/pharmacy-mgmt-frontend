import { z } from "zod";

// Aligned to BE `b/src/schemas/staff.schema.ts` (Prisma `Staff` model):
// { name, phone?, email?, role?, salary? }
export const staffSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .optional()
    .or(z.literal("")),
  role: z.string().max(50).optional().or(z.literal("")),
  salary: z.number().min(0, { message: "Salary cannot be negative" }).optional(),
});

// Aligned to BE `b/src/schemas/attendance.schema.ts`:
// service maps `data.staff -> staffId`. Fields: staff(uuid), status, date?
export const attendanceSchema = z.object({
  staff: z.string().min(1, { message: "Staff is required" }),
  status: z
    .string()
    .min(1, { message: "Status is required" })
    .max(20, { message: "Status cannot exceed 20 characters" }),
  date: z.string().optional().or(z.literal("")),
});

// Aligned to BE `b/src/schemas/salary.schema.ts`:
// service maps `data.staff -> staffId`. Fields: staff(uuid), amount, month, year, paidAt?
export const salarySchema = z.object({
  staff: z.string().min(1, { message: "Staff is required" }),
  amount: z.number().min(0, { message: "Amount cannot be negative" }),
  month: z
    .string()
    .min(1, { message: "Month is required" })
    .max(20, { message: "Month cannot exceed 20 characters" }),
  year: z.number().int().min(2000).max(2100),
  paidAt: z.string().optional().or(z.literal("")),
});
