import { z } from "zod";

// All FE schemas are aligned exactly to the BE Zod contracts (b/src/schemas/*).

export const supplierSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
  contactPerson: z.string().max(100).optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .or(z.literal("")),
  address: z.string().max(255).optional().or(z.literal("")),
});

export const customerSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }).max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().max(255).optional().or(z.literal("")),
});

export const doctorSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  specialty: z.string().max(100).optional().or(z.literal("")),
  address: z.string().max(255).optional().or(z.literal("")),
});

// Prescription is intentionally minimal (scanned-doc oriented).
export const prescriptionSchema = z.object({
  patientName: z
    .string()
    .min(1, { message: "Patient name is required" })
    .max(100),
  doctorName: z.string().max(100).optional().or(z.literal("")),
  details: z.string().max(2000).optional().or(z.literal("")),
  image: z.string().max(500).optional().or(z.literal("")),
});

export const inventoryBatchSchema = z.object({
  drugId: z.string().min(1, { message: "Drug is required" }),
  batchNumber: z.string().min(1, { message: "Batch number is required" }),
  lotNumber: z.string().optional().or(z.literal("")),
  expirationDate: z.string().min(1, { message: "Expiration date is required" }),
  initialQuantity: z.number().min(0),
  currentQuantity: z.number().min(0),
  purchasePrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  status: z
    .enum([
      "AVAILABLE",
      "LOW_STOCK",
      "OUT_OF_STOCK",
      "EXPIRED",
      "RECALLED",
      "RECALLED_RETURNED",
    ])
    .optional(),
  isActive: z.boolean().optional(),
});

// Inventory alert is minimal — only what the BE model carries.
export const inventoryAlertSchema = z.object({
  drug: z.string().min(1, { message: "Drug is required" }),
  title: z.string().min(1, { message: "Title is required" }).max(150),
  message: z.string().min(1, { message: "Message is required" }).max(1000),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  isResolved: z.boolean().optional(),
});

// Invoices are server-derived from completed sales. Direct creation form is
// deliberately not exposed in the UI — keep this schema for any internal call.
export const invoiceSchema = z.object({
  sale: z.string().min(1, { message: "Sale is required" }),
  totalAmount: z.number().min(0),
  invoiceNumber: z.string().max(50).optional().or(z.literal("")),
});

export const paymentSchema = z.object({
  invoiceId: z.string().min(1, { message: "Invoice is required" }),
  amount: z.number().min(0.01),
  method: z.enum(["CASH", "CARD", "MOBILE_BANKING"]),
  notes: z.string().max(500).optional().or(z.literal("")),
});

const returnItemSchema = z.object({
  drug: z.string().min(1, { message: "Drug is required" }),
  batch: z.string().min(1, { message: "Batch is required" }),
  quantity: z.number().min(0.01),
  unitPrice: z.number().min(0),
  reason: z.string().min(1, { message: "Reason is required" }).max(255),
});

export const returnSchema = z.object({
  returnType: z.enum(["CUSTOMER_RETURN", "SUPPLIER_RETURN"]).default("CUSTOMER_RETURN"),
  processedBy: z.string().min(1, { message: "Processed-by user is required" }),
  items: z.array(returnItemSchema).min(1, { message: "At least one item is required" }),
});

// Notification is minimal — title/message/userId.
export const notificationSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(150),
  message: z.string().min(1, { message: "Message is required" }).max(1000),
  userId: z.string().optional().or(z.literal("")),
  isRead: z.boolean().optional(),
});

export const memberSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  role: z.string().max(50).optional().or(z.literal("")),
  salary: z.number().min(0).optional(),
});

export const salarySchema = z.object({
  staff: z.string().min(1, { message: "Staff is required" }),
  amount: z.number().min(0),
  month: z.string().min(1, { message: "Month is required" }).max(20),
  year: z.number().int().min(2000).max(2100),
  paidAt: z.string().optional().or(z.literal("")),
});

export const attendanceSchema = z.object({
  staff: z.string().min(1, { message: "Staff is required" }),
  status: z.string().min(1, { message: "Status is required" }).max(20),
  date: z.string().optional().or(z.literal("")),
});
