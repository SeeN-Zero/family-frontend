"use client";

import { useMemo, useState } from "react";
import {
  Cell,
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import SummaryCard from "@/component/SummaryCard";
import {
  useCategoryBreakdown,
  useReportSummary,
  useReportTrend,
} from "@/hooks/useReports";
import { useAccounts } from "@/hooks/useAccounts";
import { useCycle } from "@/hooks/useCycle";
import {
  currentMonthLabel,
  cycleRange,
  lastCyclePeriods,
  shiftMonthLabel,
  todayISO,
} from "@/lib/date";
import { formatCurrency } from "@/lib/currency";
import type { CategoryType } from "@/hooks/types";

const TREND_PERIODS = 6;

export default function ReportsPage() {
  const { data: accounts = [] } = useAccounts(false);
  const { data: cycle } = useCycle();

  // State filter
  const [accountId, setAccountId] = useState<string>("");
  const [monthLabel, setMonthLabel] = useState<string>(currentMonthLabel());
  const [breakdownType, setBreakdownType] = useState<CategoryType>("EXPENSE");

  const cycleStartDay = cycle?.cycleStartDay ?? 1;
  const activeAccountId = accountId || undefined;

  // Range cycle aktif (default: cycle bulan berjalan).
  const activeRange = cycleRange(monthLabel, cycleStartDay);
  const reportFilter = useMemo(
    () => ({
      accountId: activeAccountId,
      dateFrom: activeRange?.from ?? "1970-01-01",
      dateTo: activeRange?.to ?? todayISO(),
    }),
    [activeAccountId, activeRange]
  );

  // Summary & breakdown untuk cycle aktif.
  const summary = useReportSummary(reportFilter);
  const breakdown = useCategoryBreakdown({
    ...reportFilter,
    type: breakdownType,
  });

  // Trend: 6 cycle terakhir (cycleStartDay bisa berubah dari setting).
  const trendPeriods = useMemo(
    () => lastCyclePeriods(TREND_PERIODS, cycleStartDay, monthLabel),
    [cycleStartDay, monthLabel]
  );
  const trend = useReportTrend(trendPeriods);

  // Pie data: warna dari kategori, fallback monokrom.
  const pieData = useMemo(
    () =>
      (breakdown.data ?? []).map((item) => ({
        name: item.categoryName,
        value: item.totalAmount,
        color: item.color ?? "#c4c7c8",
      })),
    [breakdown.data]
  );

  // Bar data: income vs expense per cycle.
  const barData = useMemo(
    () =>
      (trend.data ?? []).map((p) => ({
        label: p.label,
        income: p.totalIncome,
        expense: p.totalExpense,
      })),
    [trend.data]
  );

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-8">
      {/* Header + filter */}
      <section className="border border-primary p-6 md:p-8 bg-background flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[16px] md:text-[18px]">
            REPORTS
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                ACCOUNT
              </span>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="bg-background border border-outline-variant px-3 py-2 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary cursor-pointer min-w-[180px]"
              >
                <option value="">ALL_ACCOUNTS</option>
                {accounts.map((acc) => (
                  <option key={acc.accountId} value={acc.accountId}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                CYCLE
              </span>
              <div className="flex items-stretch border border-outline-variant">
                <button
                  type="button"
                  onClick={() =>
                    setMonthLabel((m) => shiftMonthLabel(m, -1))
                  }
                  aria-label="Previous cycle"
                  className="px-3 text-primary bg-background hover:bg-surface-variant transition-colors cursor-pointer border-r border-outline-variant"
                >
                  ‹
                </button>
                <span className="px-4 py-2 font-body-sm text-body-sm text-primary min-w-[110px] text-center">
                  {monthLabel}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setMonthLabel((m) => shiftMonthLabel(m, 1))
                  }
                  aria-label="Next cycle"
                  className="px-3 text-primary bg-background hover:bg-surface-variant transition-colors cursor-pointer border-l border-outline-variant"
                >
                  ›
                </button>
              </div>
            </label>
          </div>
        </div>

        {activeRange && (
          <div className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
            {activeRange.from} → {activeRange.to}
          </div>
        )}
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          label="TOTAL INCOME"
          amount={summary.data?.totalIncome ?? null}
          isLoading={summary.isLoading}
        />
        <SummaryCard
          label="TOTAL EXPENSE"
          amount={summary.data?.totalExpense ?? null}
          isLoading={summary.isLoading}
          variant="highlight"
        />
        <SummaryCard
          label="NET"
          amount={summary.data?.net ?? null}
          isLoading={summary.isLoading}
        />
      </section>

      {/* Category breakdown: pie chart */}
      <section className="border border-primary p-6 md:p-8 bg-background flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            CATEGORY BREAKDOWN
          </h3>
          <div className="flex gap-2">
            {(["EXPENSE", "INCOME"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setBreakdownType(t)}
                className={`px-4 py-2 font-label-caps text-label-caps uppercase tracking-wider border transition-colors cursor-pointer ${
                  breakdownType === t
                    ? "bg-primary text-background border-primary"
                    : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="h-[320px] w-full">
            {breakdown.isLoading ? (
              <div className="w-full h-full flex items-center justify-center font-label-caps text-label-caps text-outline uppercase">
                LOADING...
              </div>
            ) : pieData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center font-label-caps text-label-caps text-outline uppercase">
                NO_DATA
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="50%"
                    outerRadius="80%"
                    stroke="#131313"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#131313",
                      border: "2px dotted #8e9192",
                      borderRadius: 0,
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: 12,
                      color: "#e2e2e2",
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend list */}
          <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto">
            {pieData.length === 0 ? (
              <div className="font-label-caps text-label-caps text-outline uppercase">
                NO_CATEGORIES
              </div>
            ) : (
              pieData.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-3 border border-outline-variant px-3 py-2"
                >
                  <span
                    className="w-3 h-3 shrink-0 border border-primary"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-body-sm text-body-sm text-primary truncate flex-1 min-w-0">
                    {entry.name}
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">
                    {formatCurrency(entry.value)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trend: bar chart 6 cycle terakhir */}
      <section className="border border-primary p-6 md:p-8 bg-background flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            TREND · LAST {TREND_PERIODS} CYCLES
          </h3>
          <p className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
            INCOME VS EXPENSE
          </p>
        </div>

        <div className="h-[340px] w-full">
          {trend.isLoading ? (
            <div className="w-full h-full flex items-center justify-center font-label-caps text-label-caps text-outline uppercase">
              LOADING...
            </div>
          ) : barData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center font-label-caps text-label-caps text-outline uppercase">
              NO_DATA
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid
                  stroke="#444748"
                  strokeDasharray="2 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke="#e2e2e2"
                  tick={{ fill: "#c4c7c8", fontSize: 11 }}
                  axisLine={{ stroke: "#8e9192" }}
                  tickLine={{ stroke: "#8e9192" }}
                />
                <YAxis
                  stroke="#e2e2e2"
                  tick={{ fill: "#c4c7c8", fontSize: 11 }}
                  axisLine={{ stroke: "#8e9192" }}
                  tickLine={{ stroke: "#8e9192" }}
                  tickFormatter={(v: number) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(1)}M`
                      : v >= 1_000
                      ? `${(v / 1_000).toFixed(0)}K`
                      : String(v)
                  }
                />
                <Tooltip
                  cursor={{ fill: "#444748", opacity: 0.3 }}
                  contentStyle={{
                    backgroundColor: "#131313",
                    border: "2px dotted #8e9192",
                    borderRadius: 0,
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: 12,
                    color: "#e2e2e2",
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: "var(--font-courier-prime)",
                    fontSize: 12,
                    textTransform: "uppercase",
                    color: "#c4c7c8",
                  }}
                />
                <Bar
                  dataKey="income"
                  name="INCOME"
                  fill="#8fbf9f"
                  stroke="#8fbf9f"
                />
                <Bar
                  dataKey="expense"
                  name="EXPENSE"
                  fill="#d18f8f"
                  stroke="#d18f8f"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}
