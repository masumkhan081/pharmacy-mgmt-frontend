import { z } from "zod";

export const supplierSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }).max(100),
  phone: z.string().min(10).max(15),
  altPhone: z.string().min(10).max(15),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  address: z.string().max(55).optional(),
  deliveryFrequency: z.enum(["Daily", "Weekly", "Monthly", "On-demand"]),
  isActive: z.boolean().default(false),
  notes: z.string().max(500).optional(),
});

export const customerSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  altPhone: z.string().min(10).max(15).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  notes: z.string().max(500).optional(),
});

export const doctorSchema = z.object({
  fullName: z.string().min(2).max(100),
  specialty: z.string().min(1, { message: "Specialty is required" }),
  licenseNumber: z.string().min(1, { message: "License number is required" }),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().max(500).optional(),
});

export const prescriptionSchema = z.object({
  customer: z.string().min(1, { message: "Customer is required" }),
  prescriptionNumber: z.string().min(1, { message: "Prescription number is required" }),
  doctor: z.string().min(1, { message: "Doctor is required" }),
  expiryDate: z.string().min(1, { message: "Expiry date is required" }),
  notes: z.string().max(500).optional(),
});

export const inventoryBatchSchema = z.object({
  drug: z.string().min(1, { message: "Drug is required" }),
  batchNumber: z.string().min(1, { message: "Batch number is required" }),
  lotNumber: z.string().min(1, { message: "Lot number is required" }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  manufactureDate: z.string().min(1),
  expirationDate: z.string().min(1),
  initialQuantity: z.number().int().min(1),
  currentQuantity: z.number().int().min(0),
  costPrice: z.number().min(0.01),
  sellingPrice: z.number().min(0.01),
  purchaseDate: z.string().min(1),
  location: z.string().min(1, { message: "Storage location is required" }),
});

export const inventoryAlertSchema = z.object({
  drug: z.string().min(1, { message: "Drug is required" }),
  minThreshold: z.number().int().min(1),
  maxThreshold: z.number().int().min(1),
  reorderPoint: z.number().int().min(1),
  reorderQuantity: z.number().int().min(1),
  preferredSupplier: z.string().optional(),
  autoReorder: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdBy: z.string().min(1, { message: "Created by is required" }),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1),
  customer: z.string().min(1, { message: "Customer is required" }),
  dueDate: z.string().min(1),
  subtotal: z.number().min(0),
  taxTotal: z.number().min(0).default(0),
  discountTotal: z.number().min(0).default(0),
  grandTotal: z.number().min(0),
  notes: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().min(0.01),
  paymentDate: z.string().min(1),
  paymentMethod: z.enum([
    "CASH",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "MOBILE_BANKING",
    "BANK_TRANSFER",
    "INSURANCE",
    "OTHER",
  ]),
  invoice: z.string().optional(),
  notes: z.string().optional(),
});

export const returnSchema = z.object({
  returnType: z.enum([
    "CUSTOMER_RETURN",
    "SUPPLIER_RETURN",
    "DAMAGED_GOODS",
    "EXPIRED_DRUGS",
  ]),
  returnDate: z.string().min(1),
  totalAmount: z.number().min(0),
  notes: z.string().optional(),
});

export const notificationSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const memberSchema = z.object({
  fullName: z.string().min(1).max(100),
  phone: z.string().min(10).max(15),
  altPhone: z.string().min(10).max(15),
  email: z.string().email(),
  designation: z.enum(["admin", "manager", "pharmacist", "salesman"]),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  shift: z.enum(["Morning", "Afternoon", "Night"]).default("Morning"),
  salaryType: z.enum(["Hourly", "Weekly", "Monthly"]),
  hourlySalary: z.number().min(0).optional(),
  weeklySalary: z.number().min(0).optional(),
  monthlySalary: z.number().min(0).optional(),
  hoursPerDay: z.number().int().min(1).max(24),
  daysPerWeek: z.number().int().min(1).max(7),
  address: z.string().max(55).optional(),
});

export const salarySchema = z.object({
  staff: z.string().min(1, { message: "Staff is required" }),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(3000),
  dueAmount: z.number().min(0),
  paidAmount: z.number().min(0),
});

export const attendanceSchema = z.object({
  staff: z.string().min(1, { message: "Staff is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  shift: z.enum(["day", "evening", "night"]).default("day"),
});
