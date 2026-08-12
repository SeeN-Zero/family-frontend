"use client";

import { useState } from "react";
import { X, Plus, Edit, Trash2 } from "lucide-react";
import { useLoanPayments } from "@/hooks/useLoanPayments";
import {
  useCreateLoanPayment,
  useUpdateLoanPayment,
  useDeleteLoanPayment,
} from "@/hooks/useLoanMutations";
import PaymentFormModal from "@/component/PaymentFormModal";
import ConfirmDialog from "@/component/ConfirmDialog";
import type {
  ApiLoan,
  ApiLoanPayment,
  ApiAccount,
  CreateLoanPaymentRequest,
  UpdateLoanPaymentRequest,
} from "@/hooks/types";
import { formatShortDate } from "@/lib/date";
import { formatCurrency } from "@/lib/currency";

type LoanPaymentsPanelProps = {
  loan: ApiLoan;
  accounts: ApiAccount[];
  onClose: () => void;
};

export default function LoanPaymentsPanel({ loan, accounts, onClose }: LoanPaymentsPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<ApiLoanPayment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<ApiLoanPayment | null>(null);

  const { data: pageData, isLoading, error } = useLoanPayments(loan.loanId, 100);
  const payments: ApiLoanPayment[] = pageData?.items ?? [];
  const createPayment = useCreateLoanPayment();
  const updatePayment = useUpdateLoanPayment();
  const deletePayment = useDeleteLoanPayment();
  const activeMutation = editingPayment ? updatePayment : createPayment;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayment(null);
  };

  const handleSubmitPayment = (payload: CreateLoanPaymentRequest | UpdateLoanPaymentRequest) => {
    if (editingPayment) {
      updatePayment.mutate({ loanId: loan.loanId, paymentId: editingPayment.paymentId, payload }, { onSuccess: handleCloseModal });
      return;
    }
    createPayment.mutate({ loanId: loan.loanId, payload }, { onSuccess: handleCloseModal });
  };

  const handleConfirmDeletePayment = () => {
    if (!deletingPayment) return;
    deletePayment.mutate(
      { loanId: loan.loanId, paymentId: deletingPayment.paymentId },
      { onSuccess: () => setDeletingPayment(null) }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-primary bg-background p-6 md:p-8 bracket-corners">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h4 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">LOAN_PAYMENTS</h4>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">{loan.contactName} / {loan.accountName}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-label-caps text-label-caps uppercase tracking-wider md:w-[60%] md:min-w-[560px] md:ml-auto">
            <div className="border border-outline-variant p-3"><span className="block text-on-surface-variant">TOTAL</span><span className="text-primary">{formatCurrency(loan.amount)}</span></div>
            <div className="border border-outline-variant p-3"><span className="block text-on-surface-variant">REMAINING</span><span className="text-primary">{formatCurrency(loan.remainingAmount)}</span></div>
            <div className="border border-outline-variant p-3"><span className="block text-on-surface-variant">STATUS</span><span className="text-primary">{loan.status}</span></div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={() => { setEditingPayment(null); setIsModalOpen(true); }} className="border border-primary px-4 py-2 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" />NEW_PAYMENT</button>
          <button type="button" onClick={onClose} className="border border-outline-variant px-3 py-2 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer" aria-label="Close payments panel"><X className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="overflow-x-auto bg-background">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead><tr className="border-b border-dotted border-outline-variant"><th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant">DATE</th><th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant">ACCOUNT</th><th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant">DESCRIPTION</th><th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant text-right">AMOUNT</th><th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant text-center w-24">ACT</th></tr></thead>
          <tbody className="font-body-sm text-body-sm text-primary">
            {isLoading && <tr><td colSpan={5} className="py-8 px-4 text-center text-on-surface-variant">LOADING_PAYMENTS...</td></tr>}
            {!isLoading && error && <tr><td colSpan={5} className="py-8 px-4 text-center text-primary">* {error.message}</td></tr>}
            {!isLoading && !error && payments.length === 0 && <tr><td colSpan={5} className="py-8 px-4 text-center text-on-surface-variant">NO_PAYMENT_FOUND</td></tr>}
            {!isLoading && !error && payments.map((payment) => (
              <tr key={payment.paymentId} className="border-b border-dotted border-outline-variant hover:bg-surface-variant/40 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">{formatShortDate(payment.paymentDate)}</td><td className="py-4 px-4">{payment.accountName}</td><td className="py-4 px-4 truncate max-w-xs">{payment.description || "—"}</td><td className="py-4 px-4 text-right whitespace-nowrap">{formatCurrency(payment.amount)}</td>
                <td className="py-4 px-4"><div className="flex items-center justify-center gap-2"><button type="button" onClick={() => { setEditingPayment(payment); setIsModalOpen(true); }} title="EDIT_PAYMENT" className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"><Edit className="w-3 h-3" /></button><button type="button" onClick={() => setDeletingPayment(payment)} disabled={deletePayment.isPending} title="DELETE_PAYMENT" className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"><Trash2 className="w-3 h-3" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <PaymentFormModal accounts={accounts} payment={editingPayment ?? undefined} isPending={activeMutation.isPending} errorMessage={activeMutation.error?.message} onClose={handleCloseModal} onSubmit={handleSubmitPayment} />}
      {deletingPayment && <ConfirmDialog title="* DELETE_PAYMENT" message={`Hapus pembayaran ${formatCurrency(deletingPayment.amount)} pada ${formatShortDate(deletingPayment.paymentDate)}? Tindakan ini permanen.`} confirmLabel="DELETE" cancelLabel="CANCEL" isPending={deletePayment.isPending} errorMessage={deletePayment.error?.message} onConfirm={handleConfirmDeletePayment} onCancel={() => setDeletingPayment(null)} />}
      </div>

    </div>
  );
}

