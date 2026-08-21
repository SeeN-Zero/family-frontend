"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ArrowRight } from "lucide-react";
import { todayISO } from "@/lib/date";
import { formatCurrency, formatRupiah } from "@/lib/currency";
import { createTransferSchema, type CreateTransferInput } from "@/features/transactions/schemas";
import type { ApiAccount, CreateTransferRequest } from "@/hooks/types";

export type TransferFormPayload = CreateTransferRequest;

type TransferFormModalProps = {
  onClose: () => void;
  onSubmit: (transfer: TransferFormPayload) => void;
  accounts: ApiAccount[];
  sourceAccountId: string;
  isPending?: boolean;
  errorMessage?: string;
};


export default function TransferFormModal({
  onClose,
  onSubmit,
  accounts,
  sourceAccountId,
  isPending = false,
  errorMessage,
}: TransferFormModalProps) {
  const form = useForm<CreateTransferInput, unknown, CreateTransferRequest>({
    resolver: zodResolver(createTransferSchema),
    defaultValues: {
      sourceAccountId,
      targetAccountId: "",
      amount: "",
      transactionDate: todayISO(),
    },
  });

  const fromAccountId = useWatch({ control: form.control, name: "sourceAccountId" });
  const amount = String(useWatch({ control: form.control, name: "amount" }) ?? "");
  const activeAccounts = accounts.filter((acc) => !acc.archived);
  const fromAccount = activeAccounts.find((acc) => acc.accountId === fromAccountId);
  const toAccounts = activeAccounts.filter((acc) => acc.accountId !== fromAccountId);

  const handleSubmit = (values: CreateTransferRequest) => {
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
            TRANSFER_BETWEEN_ACCOUNTS
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex items-center justify-center p-3 -m-3 text-outline-variant hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tf-from"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              FROM_ACCOUNT
            </label>
            <select
              id="tf-from"
              {...form.register("sourceAccountId", {
                onChange: () => form.setValue("targetAccountId", ""),
              })}
              disabled={isPending}
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-40"
            >
              {activeAccounts.map((acc) => (
                <option key={acc.accountId} value={acc.accountId}>
                  {acc.name}
                </option>
              ))}
            </select>
            {fromAccount && (
              <span className="font-display-lg text-body-lg text-on-surface-variant">
                {formatCurrency(fromAccount.balance)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-primary" />
            <span className="ml-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              TRANSFER
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="tf-to"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              TO_ACCOUNT
            </label>
            <select
              id="tf-to"
              {...form.register("targetAccountId")}
              required
              disabled={isPending}
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-40"
            >
              <option value="" disabled>
                SELECT_ACCOUNT
              </option>
              {toAccounts.map((acc) => (
                <option key={acc.accountId} value={acc.accountId}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tf-amount"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
              >
                AMOUNT (RP)
              </label>
              <input
                id="tf-amount"
                type="text"
                inputMode="numeric"
                name="amount"
                value={amount}
                onChange={(e) =>
                  form.setValue("amount", formatRupiah(e.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                placeholder="0"
                required
                disabled={isPending}
                className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="tf-date"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
              >
                DATE
              </label>
              <input
                id="tf-date"
                type="date"
                {...form.register("transactionDate")}
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
              className="border border-outline-variant px-4 py-[14px] font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isPending || activeAccounts.length < 2}
              className="border border-primary px-4 py-[14px] font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "TRANSFERRING..." : "CONFIRM_TRANSFER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




