import { z } from "zod";

// Aligned to BE `b/src/schemas/sale.schema.ts`.
const saleItemSchema = z.object({
  drug: z.string().min(1, { message: "Drug is required" }),
  quantity: z.number().min(0.01, { message: "Quantity must be greater than 0" }),
  mrp: z.number().min(0, { message: "Price cannot be negative" }),
});

export const saleSchema = z.object({
  saleAt: z.coerce.date().optional(),
  drugs: z
    .array(saleItemSchema)
    .min(1, { message: "At least one item is required" }),
  bill: z.number().min(0, { message: "Bill amount cannot be negative" }),
  customerId: z.string().optional().or(z.literal("")),
});
