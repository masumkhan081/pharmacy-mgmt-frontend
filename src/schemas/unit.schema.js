import { z } from "zod";

// Aligned to BE `b/src/schemas/unit.schema.ts` (Prisma `Unit` model): { name(unique) }
export const createUnitSchema = z.object({
  name: z
    .string()
    .min(1, "Unit name is required")
    .max(50, "Unit name cannot exceed 50 characters"),
});

export const updateUnitSchema = createUnitSchema.partial();
