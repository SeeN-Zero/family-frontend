"use client";

import { useState } from "react";
import {
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronDown,
} from "lucide-react";
import { todayISO } from "@/lib/date";
import { formatRupiah, parseRupiah } from "@/lib/currency";
import type {
  ApiCategory,
  ApiTransaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "@/hooks/types";

export type TransactionFormPayload = CreateTransactionRequest | UpdateTransactionRequest;

type TransactionFormModalProps = {
  open: boolean;
  accountId: string;
  categories: ApiCategory[];
  transaction?: ApiTransaction | null;
  isPending?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSubmit: (payload: TransactionFormPayload) => void;
};

type CategoryTab = "INCOME" | "EXPENSE";


export default function TransactionFormModal({
  open,
  accountId,
  categories,
  transaction,
  isPending = false,
  errorMessage,
  onClose,
  onSubmit,
}: TransactionFormModalProps) {
  const isEdit = Boolean(transaction);
  const initialCategory =
    categories.find((cat) => cat.categoryId === transaction?.categoryId) ??
    categories[0];

  const [description, setDescription] = useState(transaction?.description ?? "");
  const [categoryId, setCategoryId] = useState(initialCategory?.categoryId ?? "");
  const [categoryType, setCategoryType] = useState<CategoryTab>(
    initialCategory?.type ?? "EXPENSE"
  );
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [amount, setAmount] = useState(
    transaction ? formatRupiah(String(transaction.amount)) : ""
  );
  const [date, setDate] = useState(transaction?.transactionDate ?? todayISO());


  if (!open) return null;

  const selectedCategory = categories.find((cat) => cat.categoryId === categoryId);
  const filteredCategories = categories.filter((cat) => cat.type === categoryType);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatRupiah(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawAmount = parseRupiah(amount);
    const parsedAmount = Number(rawAmount);
    if (!accountId || !categoryId || !parsedAmount || !date) return;

    onSubmit({
      accountId,
      categoryId,
      amount: parsedAmount,
      description: description.trim() || undefined,
      transactionDate: date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
            {isEdit ? "* EDIT_TRANSACTION_ENTRY" : "* NEW_TRANSACTION_ENTRY"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-outline-variant hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <p className="border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider mb-6">
            * {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-category"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              CATEGORY
            </label>
            <div className="relative">
              <button
                type="button"
                id="tx-category"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                disabled={isPending || categories.length === 0}
                className="w-full bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors flex items-center justify-between cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{selectedCategory?.name ?? "NO_CATEGORY"}</span>
                <ChevronDown className="w-4 h-4 text-on-surface-variant" />
              </button>

              {isCategoryOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCategoryOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 border border-primary bg-background z-50">
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {(["INCOME", "EXPENSE"] as CategoryTab[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setCategoryType(type)}
                          className={`px-4 py-2 font-label-caps text-label-caps uppercase tracking-wider transition-colors cursor-pointer border ${
                            categoryType === type
                              ? "bg-primary text-background border-primary"
                              : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-dotted border-outline-variant max-h-48 overflow-y-auto">
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat.categoryId}
                          type="button"
                          onClick={() => {
                            setCategoryId(cat.categoryId);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 font-body-sm text-body-sm transition-colors cursor-pointer text-left ${
                            categoryId === cat.categoryId
                              ? "bg-surface-variant text-primary"
                              : "text-primary hover:bg-surface-variant"
                          }`}
                        >
                          <span
                            className={
                              cat.type === "INCOME"
                                ? "text-income"
                                : "text-expense"
                            }
                          >
                            {cat.type === "INCOME" ? "+" : "-"}
                          </span>
                          {cat.name}
                        </button>
                      ))}
                      {filteredCategories.length === 0 && (
                        <div className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                          NO_CATEGORY
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <span
              className={`flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-wider ${
                selectedCategory?.type === "INCOME"
                  ? "text-income"
                  : "text-expense"
              }`}
            >
              {selectedCategory?.type === "INCOME" ? (
                <ArrowUpCircle className="w-4 h-4" />
              ) : (
                <ArrowDownCircle className="w-4 h-4" />
              )}
              {selectedCategory?.type ?? "EXPENSE"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="tx-description"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              DESCRIPTION
            </label>
            <input
              id="tx-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Gaji Bulanan / Indomaret Snacks"
              maxLength={255}
              disabled={isPending}
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tx-amount"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
              >
                AMOUNT (RP)
              </label>
              <input
                id="tx-amount"
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                required
                disabled={isPending}
                className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="tx-date"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
              >
                DATE
              </label>
              <input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isPending}
                className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isPending || !accountId || categories.length === 0}
              className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "SAVING..." : isEdit ? "UPDATE_ENTRY" : "SAVE_ENTRY"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




