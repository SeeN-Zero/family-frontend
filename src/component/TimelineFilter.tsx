// src/component/TimelineFilter.tsx
"use client";

type TimelineFilterProps = {
  months: string[];
  selectedMonth: string;
  onSelect: (month: string) => void;
};

export default function TimelineFilter({
  months,
  selectedMonth,
  onSelect,
}: TimelineFilterProps) {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
      {months.map((month) => {
        const isActive = month === selectedMonth;
        return (
          <button
            key={month}
            onClick={() => onSelect(month)}
            className={`px-4 py-2 font-display-lg-mobile text-body-sm whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              isActive
                ? "bg-primary text-background"
                : "border border-dotted border-primary text-primary bg-background hover:bg-surface-variant"
            }`}
          >
            {month}
          </button>
        );
      })}
    </div>
  );
}