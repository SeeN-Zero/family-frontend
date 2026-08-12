// src/component/SummaryCard.tsx

type SummaryCardProps = {
  label: string;
  amount: string;
  trend?: string;
  trendDirection?: "up" | "down";
  variant?: "default" | "highlight";
};

export default function SummaryCard({
  label,
  amount,
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

      <div className="font-display-lg text-display-lg">{amount}</div>

      <div
        className={`mt-2 font-body-sm text-body-sm flex items-center gap-2 ${
          isHighlight ? "" : "text-on-surface-variant"
        }`}
      ></div>
    </div>
  );
}
