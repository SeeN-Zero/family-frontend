import { z } from "zod";

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label}_WAJIB_DIISI`);

const optionalTrimmedString = (max: number, message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max, message).optional()
  );

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().email("EMAIL_TIDAK_VALID").max(255, "EMAIL_TERLALU_PANJANG").optional()
);

export const createContactSchema = z.object({
  name: requiredString("NAME").max(100, "NAME_TERLALU_PANJANG"),
  phone: optionalTrimmedString(30, "PHONE_TERLALU_PANJANG"),
  email: optionalEmail,
  notes: optionalTrimmedString(500, "NOTES_TERLALU_PANJANG"),
});

export const updateContactSchema = createContactSchema;

export type CreateContactInput = z.input<typeof createContactSchema>;
export type CreateContactRequest = z.output<typeof createContactSchema>;
export type UpdateContactInput = z.input<typeof updateContactSchema>;
export type UpdateContactRequest = z.output<typeof updateContactSchema>;
