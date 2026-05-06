import { z } from "zod";

const purchaseItemSchema = z.object({
  drug: z.string().min(1, { message: "Drug is required" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  unitPrice: z.number().min(0.01, { message: "Unit price must be at least 0.01" }),
});

export const purchaseSchema = z.object({
  purchaseAt: z.coerce.date(),
  drugs: z.array(purchaseItemSchema).min(1, { message: "At least one item is required" }),
  bill: z.number().min(0.01, { message: "Bill amount must be at least 0.01" }),
});
