"use client";

import { useState } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import LoanFormModal from "@/component/LoanFormModal";
import LoanPaymentsPanel from "@/component/LoanPaymentsPanel";
import ConfirmDialog from "@/component/ConfirmDialog";
import { useLoans } from "@/hooks/useLoans";
import { useCreateLoan, useDeleteLoan } from "@/hooks/useLoanMutations";
import { useAccounts } from "@/hooks/useAccounts";
import { useContacts } from "@/hooks/useContacts";
import { formatShortDate } from "@/lib/date";
import type { ApiLoan, CreateLoanRequest, LoanType } from "@/hooks/types";

const formatAmount = (amount: number): string =>
  `Rp ${amount.toLocaleString("id-ID")}`;

export default function LoanPage() {
  const [activeTab, setActiveTab] = useState<LoanType>("DEBT");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [deletingLoan, setDeletingLoan] = useState<ApiLoan | null>(null);

  // GET loan: difilter per tipe (DEBT / RECEIVABLE) sesuai tab aktif.
  const {
    data: pageData,
    isLoading,
    error,
  } = useLoans({ loanType: activeTab, size: 100 });

  const loans: ApiLoan[] = pageData?.items ?? [];

  const { data: accounts = [] } = useAccounts(false);
  const { data: contacts = [] } = useContacts();

  const createLoan = useCreateLoan();
  const deleteLoan = useDeleteLoan();

  // Data pinjaman diambil dari hasil query list (selalu fresh karena mutation
  // payment ikut me-invalidate loanKeys.all → remainingAmount/status ter-update).
  const selectedLoan =
    loans.find((loan) => loan.loanId === selectedLoanId) ?? null;

  const handleTabChange = (type: LoanType) => {
    setActiveTab(type);
    setSelectedLoanId(null);
  };

  const handleAddLoan = (payload: CreateLoanRequest) => {
    createLoan.mutate(payload);
  };

  const handleConfirmDelete = () => {
    if (!deletingLoan) return;
    deleteLoan.mutate(deletingLoan.loanId, {
      onSuccess: () => {
        setDeletingLoan(null);
        if (selectedLoanId === deletingLoan.loanId) setSelectedLoanId(null);
      },
    });
  };

  return (
    <>
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="bg-background border border-primary p-6 md:p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              LOAN_MANAGEMENT
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="border border-primary px-4 py-2 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              NEW_LOAN_ENTRY
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTabChange("DEBT")}
              className={`px-4 py-2 font-label-caps text-label-caps uppercase tracking-wider transition-colors cursor-pointer border ${
                activeTab === "DEBT"
                  ? "bg-primary text-background border-primary"
                  : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
              }`}
            >
              DEBT
            </button>
            <button
              onClick={() => handleTabChange("RECEIVABLE")}
              className={`px-4 py-2 font-label-caps text-label-caps uppercase tracking-wider transition-colors cursor-pointer border ${
                activeTab === "RECEIVABLE"
                  ? "bg-primary text-background border-primary"
                  : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
              }`}
            >
              RECEIVABLE
            </button>
          </div>

          <div className="overflow-x-auto max-h-[480px] overflow-y-auto bg-background">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-dotted border-outline-variant">
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    CONTACT
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell">
                    ACCOUNT
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell">
                    TYPE
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell">
                    STATUS
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden lg:table-cell">
                    DESCRIPTION
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant text-right">
                    AMOUNT
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant text-right">
                    REMAINING
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell">
                    TRANSACTION_DATE
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
                      colSpan={9}
                      className="py-8 px-4 text-center text-on-surface-variant"
                    >
                      LOADING_LOANS...
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td colSpan={9} className="py-8 px-4 text-center text-primary">
                      * {error.message}
                    </td>
                  </tr>
                )}

                {!isLoading && !error && loans.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 px-4 text-center text-on-surface-variant"
                    >
                      NO_{activeTab}_ENTRIES
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !error &&
                  loans.map((loan) => {
                    const isSelected = loan.loanId === selectedLoanId;
                    return (
                      <tr
                        key={loan.loanId}
                        onClick={() => setSelectedLoanId(loan.loanId)}
                        title="VIEW_PAYMENTS"
                        className={`transition-colors border-b border-dotted border-outline-variant last:border-b-0 cursor-pointer ${
                          isSelected
                            ? "bg-surface-variant"
                            : "hover:bg-surface-variant"
                        }`}
                      >
                        <td className="py-4 px-4 whitespace-nowrap">
                          {loan.contactName}
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          {loan.accountName}
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span className="border border-outline-variant px-2 py-1 text-[10px] font-label-caps uppercase tracking-wider text-on-surface-variant">
                            {loan.loanType}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span className="border border-outline-variant px-2 py-1 text-[10px] font-label-caps uppercase tracking-wider text-on-surface-variant">
                            {loan.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell truncate max-w-[150px] md:max-w-xs">
                          {loan.description || "—"}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {formatAmount(loan.amount)}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {formatAmount(loan.remainingAmount)}
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell whitespace-nowrap">
                          {formatShortDate(loan.transactionDate)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLoanId(loan.loanId);
                              }}
                              title="VIEW_PAYMENTS"
                              className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingLoan(loan);
                              }}
                              disabled={deleteLoan.isPending}
                              title="DELETE_LOAN"
                              className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

{selectedLoan && (
            <LoanPaymentsPanel
              loan={selectedLoan}
              accounts={accounts}
              onClose={() => setSelectedLoanId(null)}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <LoanFormModal
          accounts={accounts}
          contacts={contacts}
          defaultType={activeTab}
          isPending={createLoan.isPending}
          errorMessage={createLoan.error?.message}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddLoan}
        />
      )}

      {deletingLoan && (
        <ConfirmDialog
          title="* DELETE_LOAN"
          message={`Hapus pinjaman "${
            deletingLoan.description?.trim() || deletingLoan.contactName
          }" sebesar Rp ${deletingLoan.amount.toLocaleString(
            "id-ID"
          )}? Seluruh pembayaran terkait akan ikut terhapus. Tindakan ini permanen.`}
          confirmLabel="DELETE"
          cancelLabel="CANCEL"
          isPending={deleteLoan.isPending}
          errorMessage={deleteLoan.error?.message}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingLoan(null)}
        />
      )}
    </>
  );
}
