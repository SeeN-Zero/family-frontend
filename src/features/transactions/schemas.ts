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

export const createTransactionSchema = z.object({
  accountId: requiredString("ACCOUNT"),
  categoryId: requiredString("CATEGORY"),
  amount: z.preprocess(
    (value) => (typeof value === "string" ? value.replace(/[^\d]/g, "") : value),
    positiveAmount("AMOUNT")
  ),
  description: optionalTrimmedString(255, "DESCRIPTION_TERLALU_PANJANG"),
  transactionDate: requiredString("DATE"),
});

export const updateTransactionSchema = createTransactionSchema;

export const createTransferSchema = z.object({
  sourceAccountId: requiredString("FROM_ACCOUNT"),
  targetAccountId: requiredString("TO_ACCOUNT"),
  amount: z.preprocess(
    (value) => (typeof value === "string" ? value.replace(/[^\d]/g, "") : value),
    positiveAmount("AMOUNT")
  ),
  transactionDate: requiredString("DATE"),
}).refine((value) => value.sourceAccountId !== value.targetAccountId, {
  path: ["targetAccountId"],
  message: "AKUN_TUJUAN_HARUS_BERBEDA",
});

export type CreateTransactionInput = z.input<typeof createTransactionSchema>;
export type CreateTransactionRequest = z.output<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.input<typeof updateTransactionSchema>;
export type UpdateTransactionRequest = z.output<typeof updateTransactionSchema>;
export type CreateTransferInput = z.input<typeof createTransferSchema>;
export type CreateTransferRequest = z.output<typeof createTransferSchema>;
