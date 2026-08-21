// src/lib/date.ts
// Utility tanggal bersama supaya todayISO()/formatShortDate() tidak diduplikasi
// di tiap komponen (LoanFormModal, PaymentFormModal, TransactionFormModal,
// TransferFormModal, TransactionList, dll). cycleRange()/shiftMonthLabel()/
// formatDayMonth() dipakai filter timeline cycle bulanan di halaman transaction.

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

function formatISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
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

/** Label "MMM YY" untuk bulan berjalan (mis. "AUG 26"). */
export function currentMonthLabel(): string {
  const now = new Date();
  return `${MONTHS_SHORT[now.getMonth()]} ${String(now.getFullYear()).slice(-2)}`;
}

/**
 * Geser label bulan "MMM YY" sebesar `offset` bulan (negatif = mundur).
 * Menangani rollover tahun: "JAN 26" - 1 = "DEC 25", "DEC 26" + 1 = "JAN 27".
 * Dipakai untuk navigasi timeline: setiap period = satu bulan kalender (bulan
 * yang mengandung cycleEnd), sehingga maju/mundur satu period = ±1 bulan.
 */
export function shiftMonthLabel(label: string, offset: number): string {
  const match = /^([A-Z]{3}) (\d{2})$/.exec(label.trim().toUpperCase());
  if (!match) return label;
  const monthIndex = MONTHS_SHORT.indexOf(match[1]);
  if (monthIndex === -1) return label;
  const year = 2000 + Number(match[2]);
  const d = new Date(year, monthIndex + offset, 1);
  return `${MONTHS_SHORT[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
}

/**
 * Format tanggal ISO menjadi "DD/MM" (mis. "2026-08-25" → "25/08").
 * Mengembalikan input apa adanya jika format tidak dikenali.
 */
export function formatDayMonth(iso: string): string {
  const datePart = iso.split("T")[0];
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
  if (!match) return iso;
  return `${match[3]}/${match[2]}`;
}

function daysInMonth(year: number, month: number): number {
  // `month` 0-indexed. new Date(year, month+1, 0) = hari terakhir bulan tsb.
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Rentang `YYYY-MM-DD` inklusif untuk satu cycle bulanan, berdasarkan label
 * "MMM YY" yang dipilih.
 *
 * Label = bulan yang MENGANDUNG cycleEnd. Jadi:
 *   cycleStart = cycleStartDay di bulan SEBELUMNYA
 *   cycleEnd   = satu hari sebelum cycleStartDay di bulan terpilih
 *
 * Contoh cycle=25, label "SEP 26" → 25 Aug 26 s/d 24 Sep 26.
 * Batas tahun (Dec → Jan) ditangani karena konstruksi Date memakai bulan
 * 0-index negatif (Desember tahun sebelumnya). cycleStartDay di-clamp ke hari
 * terakhir bulan sebelumnya supaya bulan pendek (Februari) tidak menghasilkan
 * tanggal invalid. Return null jika label tidak dikenali.
 */
export function cycleRange(
  label: string,
  cycleStartDay: number
): { from: string; to: string } | null {
  const match = /^([A-Z]{3}) (\d{2})$/.exec(label.trim().toUpperCase());
  if (!match) return null;
  const monthIndex = MONTHS_SHORT.indexOf(match[1]);
  if (monthIndex === -1) return null;
  const year = 2000 + Number(match[2]);

  // cycleEnd = satu hari sebelum cycleStartDay di bulan terpilih.
  // cycleStartDay ≥ 1 sehingga cycleStartDay - 1 selalu valid di bulan tsb.
  const end = new Date(year, monthIndex, cycleStartDay - 1);

  // cycleStart = cycleStartDay di bulan sebelumnya; `monthIndex - 1` membuat
  // Desember roll ke Januari tahun sebelumnya.
  const prev = new Date(year, monthIndex - 1, 1);
  const startDay = Math.min(
    cycleStartDay,
    daysInMonth(prev.getFullYear(), prev.getMonth())
  );
  const start = new Date(prev.getFullYear(), prev.getMonth(), startDay);

  return { from: formatISO(start), to: formatISO(end) };
}
