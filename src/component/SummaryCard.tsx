// src/component/SummaryCard.tsx
import { formatCurrency } from "@/lib/currency";

type SummaryCardProps = {
  label: string;
  amount: number | null;
  isLoading?: boolean;
  variant?: "default" | "highlight";
};

export default function SummaryCard({
  label,
  amount,
  isLoading = false,
  variant = "default",
}: SummaryCardProps) {
  const isHighlight = variant === "highlight";

  return (
    <div
      className={`border border-primary p-6 relative overflow-hidden ${
        isHighlight ? "bg-primary text-background" : "bg-background"
      }`}
    >
      <div
        className={`font-label-caps text-label-caps mb-4 uppercase ${
          isHighlight ? "text-background" : "text-on-surface-variant"
        }`}
      >
        {label}
      </div>

      <div className="font-display-lg text-display-lg">
        {isLoading ? (
          <span className="animate-pulse">█████████</span>
        ) : amount !== null ? (
          formatCurrency(amount)
        ) : (
          "—"
        )}
      </div>
    </div>
  );
}

