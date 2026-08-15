import type { ApiCategory, ApiTransaction } from "@/hooks/types";

/**
 * Tentukan apakah transaksi berjenis INCOME (positif) atau EXPENSE (negatif).
 * Prioritas: tipe kategori (akurat untuk kategori sistem tanpa tanda),
 * lalu fallback ke tanda amount.
 */
export function isPositiveTransaction(
  transaction: ApiTransaction,
  category?: ApiCategory
): boolean {
  if (category?.type) return category.type === "INCOME";
  return transaction.amount >= 0;
}
