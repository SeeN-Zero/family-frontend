"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { formatRupiah } from "@/lib/currency";
import { todayISO } from "@/lib/date";
import { createLoanPaymentSchema, type CreateLoanPaymentInput } from "@/features/loans/schemas";
import type {
  ApiAccount,
  ApiLoanPayment,
  CreateLoanPaymentRequest,
  UpdateLoanPaymentRequest,
} from "@/hooks/types";

type Props = {
  accounts: ApiAccount[];
  payment?: ApiLoanPayment;
  isPending?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSubmit: (payload: CreateLoanPaymentRequest | UpdateLoanPaymentRequest) => void;
};

export default function PaymentFormModal({
  accounts,
  payment,
  isPending = false,
  errorMessage,
  onClose,
  onSubmit,
}: Props) {
  const activeAccounts = accounts.filter((account) => !account.archived);
  const isEdit = Boolean(payment);
  const form = useForm<CreateLoanPaymentInput, unknown, CreateLoanPaymentRequest>({
    resolver: zodResolver(createLoanPaymentSchema),
    defaultValues: {
      accountId: payment?.accountId ?? "",
      amount: payment ? formatRupiah(String(payment.amount)) : "",
      paymentDate: payment?.paymentDate ?? todayISO(),
      description: payment?.description ?? "",
    },
  });
  const amount = String(useWatch({ control: form.control, name: "amount" }) ?? "");

  const handleSubmit = (values: CreateLoanPaymentRequest) => {
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={isPending ? undefined : onClose} />
      <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
            {isEdit ? "EDIT_PAYMENT" : "NEW_PAYMENT"}
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
            <label htmlFor="payment-account" className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">ACCOUNT</label>
            <select id="payment-account" {...form.register("accountId")} required disabled={isPending} className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-40">
              <option value="" disabled>SELECT_ACCOUNT</option>
              {activeAccounts.map((account) => <option key={account.accountId} value={account.accountId}>{account.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="payment-amount" className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">AMOUNT (RP)</label>
            <input id="payment-amount" type="text" inputMode="numeric" name="amount" value={amount} onChange={(e) => form.setValue("amount", formatRupiah(e.target.value), { shouldDirty: true, shouldValidate: true })} placeholder="0" required disabled={isPending} className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="payment-date" className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">PAYMENT_DATE</label>
            <input id="payment-date" type="date" {...form.register("paymentDate")} required disabled={isPending} className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors disabled:opacity-40" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="payment-description" className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">DESCRIPTION</label>
            <input id="payment-description" type="text" {...form.register("description")} placeholder="e.g. Cicilan pertama" maxLength={255} disabled={isPending} className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors disabled:opacity-40" />
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} disabled={isPending} className="border border-outline-variant px-4 py-[14px] font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">CANCEL</button>
            <button type="submit" disabled={isPending} className="border border-primary px-4 py-[14px] font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">{isPending ? "SAVING..." : isEdit ? "UPDATE_PAYMENT" : "SAVE_PAYMENT"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
