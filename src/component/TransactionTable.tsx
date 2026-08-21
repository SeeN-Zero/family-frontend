"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ApiTransaction, ApiCategory } from "@/hooks/types";
import { formatShortDate } from "@/lib/date";
import { formatSignedCurrency } from "@/lib/currency";
import { isPositiveTransaction } from "@/lib/transaction";

type TransactionTableProps = {
  transactions: ApiTransaction[];
  categories: ApiCategory[];
};

export default function TransactionTable({
  transactions,
  categories,
}: TransactionTableProps) {
  // Always show 5 rows
  const rows = Array.from({ length: 5 }, (_, i) => transactions[i] || null);

  const getCategory = (transaction: ApiTransaction) =>
    categories.find((cat) => cat.categoryId === transaction.categoryId);

  return (
    <section className="border border-primary p-3 md:p-6 h-full bg-background">
      <div className="font-label-caps text-label-caps text-primary mb-4 md:mb-6 flex items-center justify-between">
        <span>RECENT TRANSACTIONS</span>
        <Link
          href="/transaction"
          className="flex items-center justify-center p-3.5 text-on-surface-variant hover:text-primary transition-colors shrink-0"
          title="View All Transactions"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-left font-body-sm text-body-sm border-collapse">
          <thead>
            <tr className="border-b border-dotted border-outline-variant">
              <th className="py-2 px-2 md:px-4 font-label-caps text-label-caps text-on-surface-variant">
                DATE
              </th>
              <th className="py-2 px-2 md:px-4 font-label-caps text-label-caps text-on-surface-variant">
                DESCRIPTION
              </th>
              <th className="py-2 px-2 md:px-4 font-label-caps text-label-caps text-on-surface-variant hidden sm:table-cell">
                CATEGORY
              </th>
              <th className="py-2 px-2 md:px-4 font-label-caps text-label-caps text-on-surface-variant text-right">
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tx, index) => {
              if (!tx) {
                return (
                  <tr
                    key={`empty-${index}`}
                    className="border-b border-dotted border-outline-variant last:border-b-0"
                  >
                    <td className="py-2 md:py-3 px-2 md:px-4 text-on-surface-variant/30">—</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-on-surface-variant/30">—</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-on-surface-variant/30 hidden sm:table-cell">—</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-right text-on-surface-variant/30">
                      —
                    </td>
                  </tr>
                );
              }

              const category = getCategory(tx);
              const isPositive = isPositiveTransaction(tx, category);
              const description = tx.description?.trim() || tx.categoryName;

              return (
                <tr
                  key={tx.transactionId}
                  className="hover:bg-surface-variant transition-colors border-b border-dotted border-outline-variant last:border-b-0"
                >
                  <td className="py-2 md:py-3 px-2 md:px-4 whitespace-nowrap">
                    {formatShortDate(tx.transactionDate)}
                  </td>
                  <td className="py-2 md:py-3 px-2 md:px-4 truncate max-w-[100px] sm:max-w-[140px] md:max-w-[180px]">
                    {description || "NO_DESCRIPTION"}
                  </td>
                  <td className="py-2 md:py-3 px-2 md:px-4 hidden sm:table-cell">
                    <span className="border border-outline-variant px-1.5 md:px-2 py-0.5 md:py-1 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
                      {tx.categoryName}
                    </span>
                  </td>
                  <td
                    className={`py-2 md:py-3 px-2 md:px-4 text-right whitespace-nowrap ${
                      isPositive ? "text-income" : "text-expense"
                    }`}
                  >
                    {formatSignedCurrency(tx.amount, isPositive)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

