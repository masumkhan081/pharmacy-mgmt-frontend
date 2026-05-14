import { z } from "zod";

// Aligned to BE `b/src/schemas/purchase.schema.ts`.
const purchaseItemSchema = z.object({
  drug: z.string().min(1, { message: "Drug is required" }),
  quantity: z.number().min(0.01, { message: "Quantity must be greater than 0" }),
  purchasePrice: z.number().min(0, { message: "Purchase price cannot be negative" }),
  mrp: z.number().min(0, { message: "MRP cannot be negative" }),
  batchNumber: z.string().min(1, { message: "Batch number is required" }),
  expirationDate: z.coerce.date().refine((date) => date > new Date(), {
    message: "Expiration date must be in the future",
  }),
});

export const purchaseSchema = z.object({
  purchaseAt: z.coerce.date(),
  supplier: z.string().optional().or(z.literal("")),
  drugs: z
    .array(purchaseItemSchema)
    .min(1, { message: "At least one item is required" }),
  bill: z.number().min(0, { message: "Bill amount cannot be negative" }),
});
