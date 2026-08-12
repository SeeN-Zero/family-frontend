export function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function formatSignedCurrency(amount: number, isPositive: boolean): string {
  const sign = isPositive ? "+" : "-";
  return `${sign} ${formatCurrency(Math.abs(amount))}`;
}


export function formatRupiah(value: string): string {
  const clean = value.replace(/[^\d]/g, "");
  if (!clean) return "";
  return Number(clean).toLocaleString("id-ID");
}

export function parseRupiah(value: string): string {
  return value.replace(/[^\d]/g, "");
}