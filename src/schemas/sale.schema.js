import { z } from "zod";

const saleItemSchema = z.object({
  drug: z.string().min(1, { message: "Drug is required" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  mrp: z.number().min(0.01, { message: "MRP must be at least 0.01" }),
});

export const saleSchema = z.object({
  saleAt: z.coerce.date(),
  drugs: z.array(saleItemSchema).min(1, { message: "At least one item is required" }),
  bill: z.number().min(0.01, { message: "Bill amount must be at least 0.01" }),
});
