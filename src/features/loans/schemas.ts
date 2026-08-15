import { z } from "zod";

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label}_WAJIB_DIISI`);

const positiveAmount = (label: string) =>
  z.coerce.number().positive(`${label}_HARUS_LEBIH_BESAR_DARI_0`);

const optionalTrimmedString = (max: number, message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max, message).optional()
  );

const loanTypeSchema = z.enum(["DEBT", "RECEIVABLE"]);

export const createLoanSchema = z.object({
  contactId: requiredString("CONTACT"),
  accountId: requiredString("ACCOUNT"),
  loanType: loanTypeSchema,
  amount: z.preprocess(
    (value) => (typeof value === "string" ? value.replace(/[^\d]/g, "") : value),
    positiveAmount("AMOUNT")
  ),
  description: optionalTrimmedString(255, "DESCRIPTION_TERLALU_PANJANG"),
  transactionDate: requiredString("TRANSACTION_DATE"),
  dueDate: z
    .preprocess(
      (value) =>
        typeof value === "string" && value.trim() === "" ? undefined : value,
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "DUE_DATE_TIDAK_VALID")
        .optional()
    ),
});

export const createLoanPaymentSchema = z.object({
  accountId: requiredString("ACCOUNT"),
  amount: z.preprocess(
    (value) => (typeof value === "string" ? value.replace(/[^\d]/g, "") : value),
    positiveAmount("AMOUNT")
  ),
  paymentDate: requiredString("PAYMENT_DATE"),
  description: optionalTrimmedString(255, "DESCRIPTION_TERLALU_PANJANG"),
});

export const updateLoanPaymentSchema = createLoanPaymentSchema;

export type CreateLoanInput = z.input<typeof createLoanSchema>;
export type CreateLoanRequest = z.output<typeof createLoanSchema>;
export type CreateLoanPaymentInput = z.input<typeof createLoanPaymentSchema>;
export type CreateLoanPaymentRequest = z.output<typeof createLoanPaymentSchema>;
export type UpdateLoanPaymentInput = z.input<typeof updateLoanPaymentSchema>;
export type UpdateLoanPaymentRequest = z.output<typeof updateLoanPaymentSchema>;
