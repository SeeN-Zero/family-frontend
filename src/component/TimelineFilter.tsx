// src/component/TimelineFilter.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cycleRange, formatDayMonth, shiftMonthLabel } from "@/lib/date";

type TimelineFilterProps = {
  /** Label bulan terpilih ("MMM YY") — bulan yang mengandung cycleEnd. */
  selectedMonth: string;
  /** Hari mulai cycle (1-25), dari setting cycle user. */
  cycleStartDay: number;
  onSelect: (month: string) => void;
};

export default function TimelineFilter({
  selectedMonth,
  cycleStartDay,
  onSelect,
}: TimelineFilterProps) {
  // Satu sumber kebenaran = selectedMonth (center). Period kiri/kanan
  // diturunkan dari center dengan geser ±1 bulan — tidak ada state terpisah,
  // sehingga navigasi tak membatasi arah/jumlah langkah.
  const prev = shiftMonthLabel(selectedMonth, -1);
  const next = shiftMonthLabel(selectedMonth, 1);

  const center = cycleRange(selectedMonth, cycleStartDay);
  const left = cycleRange(prev, cycleStartDay);
  const right = cycleRange(next, cycleStartDay);

  const itemLabel = (range: { from: string; to: string } | null): string =>
    range ? `${formatDayMonth(range.from)} - ${formatDayMonth(range.to)}` : "??";

  return (
    <div className="flex items-center gap-3 w-full">
      <button
        type="button"
        onClick={() => onSelect(prev)}
        aria-label="Previous period"
        className="h-12 border border-primary px-4 text-primary bg-background hover:bg-surface-variant transition-colors cursor-pointer shrink-0 flex items-center justify-center"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex flex-1 min-w-0 gap-3 scrollbar-hide">
        <button
          type="button"
          onClick={() => onSelect(prev)}
          className="hidden sm:flex flex-1 min-w-0 h-12 px-4 font-display-lg-mobile text-body-sm whitespace-nowrap cursor-pointer transition-colors border border-primary text-primary bg-background hover:bg-surface-variant truncate flex items-center justify-center"
        >
          {itemLabel(left)}
        </button>

        <button
          type="button"
          aria-current="true"
          className="flex-1 min-w-0 h-12 px-4 font-display-lg-mobile text-body-sm whitespace-nowrap cursor-pointer bg-primary text-background truncate flex items-center justify-center"
        >
          {itemLabel(center)}
        </button>

        <button
          type="button"
          onClick={() => onSelect(next)}
          className="hidden sm:flex flex-1 min-w-0 h-12 px-4 font-display-lg-mobile text-body-sm whitespace-nowrap cursor-pointer transition-colors border border-primary text-primary bg-background hover:bg-surface-variant truncate flex items-center justify-center"
        >
          {itemLabel(right)}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSelect(next)}
        aria-label="Next period"
        className="h-12 border border-primary px-4 text-primary bg-background hover:bg-surface-variant transition-colors cursor-pointer shrink-0 flex items-center justify-center"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
