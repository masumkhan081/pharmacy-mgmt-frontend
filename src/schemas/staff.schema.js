import { z } from "zod";

// Staff Schema
export const staffSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Full name cannot exceed 100 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .optional()
    .or(z.literal("")),
  phone: z.string().min(1, { message: "Phone number is required" }),
  role: z.enum(["ADMIN", "MANAGER", "PHARMACIST", "SALESMAN", "ACCOUNTANT"], {
    message: "Invalid role",
  }),
  address: z.string().optional(),
  dateOfJoining: z.string().optional(),
  salary: z.number().positive({ message: "Salary must be positive" }).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

// Attendance Schema
export const attendanceSchema = z.object({
  staffId: z.string().min(1, { message: "Staff ID is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  status: z.enum(["PRESENT", "ABSENT", "LEAVE", "HALF_DAY"], {
    message: "Invalid status",
  }),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  notes: z.string().optional(),
});

// Salary Schema
export const salarySchema = z.object({
  staffId: z.string().min(1, { message: "Staff ID is required" }),
  month: z.string().min(1, { message: "Month is required" }),
  year: z.number().int().min(2000).max(2100),
  basicSalary: z.number().positive({ message: "Basic salary must be positive" }),
  bonus: z.number().nonnegative().optional(),
  deductions: z.number().nonnegative().optional(),
  netSalary: z.number().positive({ message: "Net salary must be positive" }),
  paymentDate: z.string().optional(),
  status: z.enum(["PAID", "PENDING", "PARTIALLY_PAID"]).optional(),
});
