"use client";

import { Suspense, useState } from "react";
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
import type {
  ApiTransaction,
  CreateAccountRequest,
  CreateTransactionRequest,
  CreateTransferRequest,
  UpdateAccountRequest,
  UpdateTransactionRequest,
} from "@/hooks/types";

const MONTHS = [
  "AUG 24",
  "SEP 24",
  "OCT 24",
  "NOV 24",
  "DEC 24",
  "JAN 25",
  "FEB 25",
  "MAR 25",
  "APR 25",
  "MAY 25",
  "JUN 25",
];

function TransactionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlAccountId = searchParams.get("accountId") ?? "";

  const [selectedAccountId, setSelectedAccountId] = useState(urlAccountId);
  const [selectedMonth, setSelectedMonth] = useState("OCT 24");
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

  // GET transaction: sementara hanya accountId yang dikirim; categoryId dan
  // rentang tanggal dikosongkan.
  const {
    data: pageData,
    isLoading: isLoadingTransactions,
    error: transactionError,
  } = useTransactions(
    { accountId: selectedAccountId },
    Boolean(selectedAccountId)
  );

  const transactions: ApiTransaction[] = pageData?.items ?? [];

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const createTransfer = useCreateTransfer();
  const createAccount = useCreateAccount();

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
    setSelectedAccountId(accountId);
    router.replace(`/transaction?accountId=${encodeURIComponent(accountId)}`, {
      scroll: false,
    });
  };


  return (
    <>
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="bg-background border border-primary p-6 md:p-8 flex flex-col gap-8">
          <div className="min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                ACCOUNT
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  disabled={
                    !selectedAccountId ||
                    accounts.filter((a) => !a.archived).length < 2
                  }
                  title="TRANSFER"
                  className="border border-primary px-4 py-2 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  TRANSFER
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!selectedAccountId}
                  title="NEW_TRANSACTION"
                  className="border border-primary px-4 py-2 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  NEW_TRANSACTION
                </button>
              </div>
            </div>
            <div className="flex items-stretch gap-2">
              <div className="flex-1 min-w-0">
                <AccountSelector
                  accounts={accounts}
                  selectedId={selectedAccountId}
                  onSelect={handleSelectAccount}
                  disabled={isLoadingAccounts}
                />
              </div>
              <button
                onClick={() => setIsAddAccountModalOpen(true)}
                className="border border-primary px-4 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
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
              months={MONTHS}
              selectedMonth={selectedMonth}
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
          key={`create-${selectedAccountId}-${manualCategories.map((category) => category.categoryId).join("-")}`}
          open={isModalOpen}
          accountId={selectedAccountId}
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
          accountId={selectedAccountId}
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
          key={selectedAccountId}
          accounts={accounts}
          sourceAccountId={selectedAccountId}
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


