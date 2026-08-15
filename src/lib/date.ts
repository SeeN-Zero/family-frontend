// src/lib/date.ts
// Utility tanggal bersama supaya todayISO()/formatShortDate() tidak diduplikasi
// di tiap komponen (LoanFormModal, PaymentFormModal, TransactionFormModal,
// TransferFormModal, TransactionList, dll). recentMonthLabels()/monthRange()
// dipakai filter timeline bulanan di halaman transaction.

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

/**
 * Bulan aktif (berjalan dari bulan berjalan ke belakang) dalam format
 * "MMM YY" kapital, mis. ["AUG 26", "JUL 26", ...]. `count` = jumlah bulan.
 */
export function recentMonthLabels(count = 12): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = MONTHS_SHORT[d.getMonth()];
    const y = String(d.getFullYear()).slice(-2);
    labels.push(`${m} ${y}`);
  }
  return labels;
}

/**
 * Rentang tanggal `YYYY-MM-DD` inklusif untuk satu bulan kalender penuh,
 * berdasarkan label "MMM YY" (mis. "AUG 26"). Return null jika label tidak
 * dikenali.
 */
export function monthRange(
  label: string
): { from: string; to: string } | null {
  const match = /^([A-Z]{3}) (\d{2})$/.exec(label.trim().toUpperCase());
  if (!match) return null;
  const monthIndex = MONTHS_SHORT.indexOf(match[1]);
  if (monthIndex === -1) return null;
  const year = 2000 + Number(match[2]);
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  return {
    from: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`,
    to: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`,
  };
}
