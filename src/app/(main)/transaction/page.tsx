"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, ArrowLeftRight } from "lucide-react";
import AccountSelector from "@/component/AccountSelector";
import TimelineFilter from "@/component/TimelineFilter";
import TransactionList from "@/component/TransactionList";
import TransactionFormModal, {
  TransactionFormPayload,
} from "@/component/TransactionFormModal";
import TransferFormModal, {
  TransferFormPayload,
} from "@/component/TransferFormModal";
import AccountFormModal from "@/component/AccountFormModal";
import ConfirmDialog from "@/component/ConfirmDialog";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/hooks/useTransactionMutations";
import { useCreateTransfer } from "@/hooks/useTransferMutations";
import { useCreateAccount } from "@/hooks/useAccountMutations";
import { useCycle } from "@/hooks/useCycle";
import { currentMonthLabel, cycleRange } from "@/lib/date";
import type {
  ApiTransaction,
  CreateAccountRequest,
  CreateTransactionRequest,
  CreateTransferRequest,
  UpdateAccountRequest,
  UpdateTransactionRequest,
} from "@/hooks/types";

function TransactionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // URL adalah satu-satunya sumber kebenaran untuk filter akun; tombol
  // browser back/forward langsung tersinkron via searchParams.
  const urlAccountId = searchParams.get("accountId") ?? "ALL";
  const activeAccountId =
    urlAccountId === "ALL" ? "" : urlAccountId;

  // selectedMonth diinisialisasi deterministik ("AUG 26") supaya SSR & first
  // client render cocok. Setelah mount, `currentMonthLabel()` baru diterapkan
  // lewat effect satu kali sehingga tidak ada perbedaan waktu server vs client
  // yang bikin HTML tidak cocok. mountedRef + isMounted flag mencegah loop
  // re-render saat React Strict Mode double-invoke.
  const [selectedMonth, setSelectedMonth] = useState("AUG 26");
  const [isMounted, setIsMounted] = useState(false);
  const mountedOnceRef = useRef(false);
  useEffect(() => {
    if (!mountedOnceRef.current) {
      mountedOnceRef.current = true;
      setIsMounted(true);
      setSelectedMonth(currentMonthLabel());
    }
  }, []);
  const mounted = isMounted;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<ApiTransaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<ApiTransaction | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);


  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts(
    false
  );
  // includeSystem=true: FE perlu mengetahui type kategori system untuk
  // membaca tanda/warna transaksi system (transfer, loan payment, dll).
  const { data: categories = [] } = useCategories(undefined, undefined, true);
  const manualCategories = categories.filter((category) => !category.isSystem);

  // Cycle setting dari server: hari mulai cycle bulanan pembukuan. Filter
  // transaksi memakai rentang cycle, bukan bulan kalender penuh.
  const { data: cycle } = useCycle();
  const cycleStartDay = cycle?.cycleStartDay ?? 1;

  // Label bulan terpilih = bulan yang mengandung cycleEnd.
  const activeCycle =
    cycleStartDay > 0 ? cycleRange(selectedMonth, cycleStartDay) : null;

  // GET transaction: accountId + rentang cycle dari TimelineFilter.
  const {
    data: pageData,
    isLoading: isLoadingTransactions,
    error: transactionError,
  } = useTransactions(
    {
      accountId: activeAccountId || undefined,
      dateFrom: activeCycle?.from,
      dateTo: activeCycle?.to,
    },
    true
  );

  const transactions: ApiTransaction[] = pageData?.items ?? [];

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const createTransfer = useCreateTransfer();
  const createAccount = useCreateAccount();

  // Compute button disabled states - these need to be stable during hydration
  const activeAccounts = accounts.filter((a) => !a.archived);
  const isTransferDisabled =
    (urlAccountId === "ALL" ||
      !urlAccountId ||
      activeAccounts.length < 2) &&
    mounted;
  const isNewTransactionDisabled =
    (urlAccountId === "ALL" || !urlAccountId) && mounted;

  const handleAddTransaction = (payload: TransactionFormPayload) => {
    createTransaction.mutate(payload as CreateTransactionRequest, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleEditTransaction = (payload: TransactionFormPayload) => {
    if (!editingTransaction) return;
    updateTransaction.mutate(
      {
        transactionId: editingTransaction.transactionId,
        payload: payload as UpdateTransactionRequest,
      },
      { onSuccess: () => setEditingTransaction(null) }
    );
  };

  const handleDeleteTransaction = () => {
    if (!deletingTransaction) return;
    deleteTransaction.mutate(deletingTransaction.transactionId, {
      onSuccess: () => setDeletingTransaction(null),
    });
  };

  const handleTransfer = (payload: TransferFormPayload) => {
    createTransfer.mutate(payload as CreateTransferRequest, {
      onSuccess: () => setIsTransferModalOpen(false),
    });
  };

  const handleAddAccount = (
    payload: CreateAccountRequest | UpdateAccountRequest
  ) => {
    createAccount.mutate(payload as CreateAccountRequest, {
      onSuccess: () => setIsAddAccountModalOpen(false),
    });
  };

  const handleSelectAccount = (accountId: string) => {
    // Sinkronkan ke URL saja — query bereaksi otomatis lewat useSearchParams.
    if (accountId === "ALL") {
      router.replace("/transaction", { scroll: false });
    } else {
      router.replace(`/transaction?accountId=${encodeURIComponent(accountId)}`, {
        scroll: false,
      });
    }
  };


  return (
    <>
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="bg-background border border-primary p-6 md:p-8 flex flex-col gap-8">
          <div className="min-w-0">
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[16px] md:text-[18px]">
                ACCOUNT
              </h3>
              <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center">
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  disabled={isTransferDisabled}
                  title="TRANSFER"
                  className="border border-primary px-4 py-3 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-1 sm:flex-none"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  TRANSFER
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isNewTransactionDisabled}
                  title="NEW_TRANSACTION"
                  className="border border-primary px-4 py-3 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-1 sm:flex-none"
                >
                  <Plus className="w-4 h-4" />
                  NEW_TRANSACTION
                </button>
              </div>
            </div>
            {/* Mobile: selector full-width, ADD_ACCOUNT tombol kompak di bawah
                (h-12), bukan button raksasa yang stretch setinggi selector.
                Desktop: kembali ke baris samping (md:self-stretch). */}
            <div className="flex flex-col md:flex-row items-stretch gap-2">
              <div className="flex-1 min-w-0">
                <AccountSelector
                  accounts={accounts}
                  selectedId={urlAccountId}
                  onSelect={handleSelectAccount}
                  disabled={mounted && isLoadingAccounts}
                />
              </div>
              <button
                onClick={() => setIsAddAccountModalOpen(true)}
                className="border border-primary px-4 h-12 md:h-auto font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                ADD_ACCOUNT
              </button>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase tracking-wider">
              TIMELINE_FILTER
            </h3>
            <TimelineFilter
              selectedMonth={selectedMonth}
              cycleStartDay={cycleStartDay}
              onSelect={setSelectedMonth}
            />
          </div>

          <div className="min-w-0">
            <TransactionList
              transactions={transactions}
              categories={categories}
              isLoading={isLoadingTransactions}
              errorMessage={transactionError?.message}
              onEdit={setEditingTransaction}
              onDelete={setDeletingTransaction}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TransactionFormModal
          key={`create-${urlAccountId}-${manualCategories.map((category) => category.categoryId).join("-")}`}
          open={isModalOpen}
          accountId={urlAccountId}
          categories={manualCategories}
          isPending={createTransaction.isPending}
          errorMessage={createTransaction.error?.message}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
        />
      )}

      {editingTransaction && (
        <TransactionFormModal
          key={`edit-${editingTransaction.transactionId}-${manualCategories.map((category) => category.categoryId).join("-")}`}
          open={Boolean(editingTransaction)}
          // Pakai account asli milik transaksi yang diedit, bukan akun yang
          // sedang dipilih — edit TIDAK boleh memindahkan transaksi ke akun lain.
          accountId={editingTransaction.accountId}
          categories={manualCategories}
          transaction={editingTransaction}
          isPending={updateTransaction.isPending}
          errorMessage={updateTransaction.error?.message}
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleEditTransaction}
        />
      )}

      {deletingTransaction && (
        <ConfirmDialog
          title="* DELETE_TRANSACTION"
          message={`Hapus transaksi "${
            deletingTransaction.description?.trim() ||
            deletingTransaction.categoryName
          }" sebesar Rp ${Math.abs(deletingTransaction.amount).toLocaleString(
            "id-ID"
          )}? Tindakan ini permanen.`}
          confirmLabel="DELETE"
          cancelLabel="CANCEL"
          isPending={deleteTransaction.isPending}
          errorMessage={deleteTransaction.error?.message}
          onConfirm={handleDeleteTransaction}
          onCancel={() => setDeletingTransaction(null)}
        />
      )}

      {isTransferModalOpen && (
        <TransferFormModal
          key={urlAccountId}
          accounts={accounts}
          sourceAccountId={urlAccountId}
          isPending={createTransfer.isPending}
          errorMessage={createTransfer.error?.message}
          onClose={() => setIsTransferModalOpen(false)}
          onSubmit={handleTransfer}
        />
      )}

      {isAddAccountModalOpen && (
        <AccountFormModal
          onClose={() => setIsAddAccountModalOpen(false)}
          onSubmit={handleAddAccount}
        />
      )}
    </>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex items-center justify-center py-16">
          <div className="border-2 border-primary bg-surface p-8 text-primary font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-3">
            LOADING...
          </div>
        </div>
      }
    >
      <TransactionsPageContent />
    </Suspense>
  );
}


