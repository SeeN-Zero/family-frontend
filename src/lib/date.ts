// src/lib/date.ts
// Utility tanggal bersama supaya todayISO()/formatShortDate() tidak diduplikasi
// di tiap komponen (LoanFormModal, PaymentFormModal, TransactionFormModal,
// TransferFormModal, TransactionList, dll).

const MONTHS_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/** Tanggal lokal hari ini dalam format ISO `YYYY-MM-DD`. */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Format tanggal ISO (`YYYY-MM-DD`, toleran terhadap datetime) menjadi
 * "DD MMM YY" kapital (mis. "06 AUG 26"). Mengembalikan input apa adanya
 * jika format tidak dikenali.
 */
export function formatShortDate(iso: string): string {
  if (!iso) return "";
  const datePart = iso.split("T")[0];
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
  if (!match) return iso;
  const [, y, m, d] = match;
  return `${d} ${MONTHS_SHORT[Number(m) - 1]} ${y.slice(-2)}`;
}
