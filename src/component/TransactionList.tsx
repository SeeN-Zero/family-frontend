// src/component/TransactionsList.tsx
"use client";

import { Pencil, X } from "lucide-react";
import { formatShortDate } from "@/lib/date";
import { formatSignedCurrency } from "@/lib/currency";
import { isPositiveTransaction } from "@/lib/transaction";
import type { ApiCategory, ApiTransaction } from "@/hooks/types";

type TransactionsListProps = {
  transactions: ApiTransaction[];
  categories: ApiCategory[];
  isLoading?: boolean;
  errorMessage?: string;
  onEdit?: (transaction: ApiTransaction) => void;
  onDelete?: (transaction: ApiTransaction) => void;
};

export default function TransactionsList({
  transactions,
  categories,
  isLoading = false,
  errorMessage,
  onEdit,
  onDelete,
}: TransactionsListProps) {
  const getCategory = (transaction: ApiTransaction) =>
    categories.find((cat) => cat.categoryId === transaction.categoryId);

  return (
    <div className="overflow-x-auto max-h-[480px] overflow-y-auto bg-background">
      <table className="w-full min-w-[760px] text-left border-collapse">
        <thead className="sticky top-0 bg-background z-10">
          <tr className="border-b border-dotted border-outline-variant">
            <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
              DATE
            </th>
            <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
              DESCRIPTION
            </th>
            <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell">
              CATEGORY
            </th>
            <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant text-right">
              AMOUNT
            </th>
            <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant text-center w-24">
              ACT
            </th>
          </tr>
        </thead>
        <tbody className="font-body-sm text-body-sm text-primary">
          {isLoading && (
            <tr>
              <td
                colSpan={5}
                className="py-8 px-4 text-center text-on-surface-variant"
              >
                LOADING_TRANSACTIONS...
              </td>
            </tr>
          )}

          {!isLoading && errorMessage && (
            <tr>
              <td colSpan={5} className="py-8 px-4 text-center text-primary">
                * {errorMessage}
              </td>
            </tr>
          )}

          {!isLoading && !errorMessage && transactions.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-8 px-4 text-center text-on-surface-variant"
              >
                NO_TRANSACTIONS
              </td>
            </tr>
          )}

          {!isLoading &&
            !errorMessage &&
            transactions.map((tx) => {
              const category = getCategory(tx);
              const isPositive = isPositiveTransaction(tx, category);
              const description = tx.description?.trim() || tx.categoryName;

              return (
                <tr
                  key={tx.transactionId}
                  className="hover:bg-surface-variant transition-colors border-b border-dotted border-outline-variant last:border-b-0"
                >
                  <td className="py-4 px-4 whitespace-nowrap">
                    {formatShortDate(tx.transactionDate)}
                  </td>
                  <td className="py-4 px-4 truncate max-w-[180px] md:max-w-xs">
                    {description || "NO_DESCRIPTION"}
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <span className="border border-outline-variant px-2 py-1 text-[10px] font-label-caps uppercase tracking-wider text-on-surface-variant">
                      {tx.categoryName}
                    </span>
                  </td>
                  <td
                    className={`py-4 px-4 text-right whitespace-nowrap ${
                      isPositive ? "text-income" : "text-expense"
                    }`}
                  >
                    {formatSignedCurrency(tx.amount, isPositive)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(tx)}
                        className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
                        title="EDIT_TRANSACTION"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(tx)}
                        className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
                        title="DELETE_TRANSACTION"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

