import { z } from "zod";

const categoryTypeSchema = z.enum(["INCOME", "EXPENSE"]);
const requiredString = (label: string) =>
  z.string().trim().min(1, `${label}_WAJIB_DIISI`);

export const createCategorySchema = z.object({
  name: requiredString("CATEGORY_NAME")
    .max(100, "CATEGORY_NAME_TERLALU_PANJANG")
    .transform((value) => value.toUpperCase()),
  type: categoryTypeSchema,
  icon: requiredString("ICON").max(50).optional(),
  color: z.string().trim().regex(/^#([0-9A-Fa-f]{6})$/, "COLOR_TIDAK_VALID").optional(),
});

export const updateCategorySchema = z.object({
  name: requiredString("CATEGORY_NAME")
    .max(100, "CATEGORY_NAME_TERLALU_PANJANG")
    .transform((value) => value.toUpperCase()),
  icon: requiredString("ICON").max(50).optional(),
  color: z.string().trim().regex(/^#([0-9A-Fa-f]{6})$/, "COLOR_TIDAK_VALID").optional(),
  displayOrder: z.number().int().min(0).optional(),
  isArchived: z.boolean().optional(),
});

export type CreateCategoryInput = z.input<typeof createCategorySchema>;
export type CreateCategoryRequest = z.output<typeof createCategorySchema>;
export type UpdateCategoryInput = z.input<typeof updateCategorySchema>;
export type UpdateCategoryRequest = z.output<typeof updateCategorySchema>;
