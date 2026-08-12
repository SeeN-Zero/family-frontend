import { z } from "zod";

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label}_WAJIB_DIISI`);

export const currencyCodeSchema = z.enum(["IDR"]);

export const createAccountSchema = z.object({
  name: requiredString("NAME").max(50, "NAME_TERLALU_PANJANG").transform((value) => value.toUpperCase()),
  currency: currencyCodeSchema,
  icon: requiredString("ICON").max(50).optional(),
  color: z.string().trim().regex(/^#([0-9A-Fa-f]{6})$/, "COLOR_TIDAK_VALID").optional(),
});

export const updateAccountSchema = createAccountSchema.extend({
  displayOrder: z.number().int().min(0).optional(),
});

export type CreateAccountInput = z.input<typeof createAccountSchema>;
export type CreateAccountRequest = z.output<typeof createAccountSchema>;
export type UpdateAccountInput = z.input<typeof updateAccountSchema>;
export type UpdateAccountRequest = z.output<typeof updateAccountSchema>;
