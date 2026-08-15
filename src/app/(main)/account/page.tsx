"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
  Landmark,
  PiggyBank,
  CreditCard,
  Banknote,
  Coins,
  Eye,
} from "lucide-react";
import AccountFormModal from "@/component/AccountFormModal";
import ConfirmDialog from "@/component/ConfirmDialog";
import { useAccounts } from "@/hooks/useAccounts";
import {
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "@/hooks/useAccountMutations";
import { formatCurrency } from "@/lib/currency";
import type {
  ApiAccount,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/hooks/types";

// Peta icon akun (nama dari form modal) ke komponen lucide.
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  wallet: Wallet,
  landmark: Landmark,
  "piggy-bank": PiggyBank,
  "credit-card": CreditCard,
  banknote: Banknote,
  coins: Coins,
};

const resolveColor = (color: string | null): string =>
  color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#4CAF50";


export default function AccountPage() {
  const router = useRouter();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ApiAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<ApiAccount | null>(
    null
  );

  // TanStack Query: daftar akun di-cache per kombinasi includeArchived.
  const {
    data: accounts = [],
    isLoading,
    error,
  } = useAccounts(includeArchived);

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const mutationError =
    createAccount.error ?? updateAccount.error ?? deleteAccount.error;

  const handleViewTransactions = (accountId: string) => {
    router.push(`/transaction?accountId=${encodeURIComponent(accountId)}`);
  };

  // Dipakai untuk mode create (tanpa editingAccount) maupun edit.
  const handleSubmit = (
    payload: CreateAccountRequest | UpdateAccountRequest
  ) => {
    if (editingAccount) {
      updateAccount.mutate(
        {
          accountId: editingAccount.accountId,
          payload: payload as UpdateAccountRequest,
        },
        { onSuccess: () => setEditingAccount(null) }
      );
    } else {
      createAccount.mutate(payload as CreateAccountRequest);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingAccount) return;
    deleteAccount.mutate(deletingAccount.accountId, {
      onSuccess: () => setDeletingAccount(null),
    });
  };

  return (
    <>
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="bg-background border border-primary p-6 md:p-8 flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              ACCOUNT_MANAGEMENT
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={includeArchived}
                onClick={() => setIncludeArchived((prev) => !prev)}
                className="flex items-center gap-2 border border-outline-variant px-3 py-2 font-label-caps text-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className={`relative inline-block w-8 h-4 border transition-colors ${
                    includeArchived
                      ? "bg-primary border-primary"
                      : "bg-background border-outline-variant"
                  }`}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 transition-all ${
                      includeArchived
                        ? "left-[14px] bg-background"
                        : "left-[2px] bg-on-surface-variant"
                    }`}
                  />
                </span>
                {includeArchived ? "HIDE ARCHIVED" : "SHOW ARCHIVED"}
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="border border-primary px-4 py-2 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                NEW_ACCOUNT
              </button>
            </div>
          </div>

          {(error || mutationError) && (
            <p className="border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider">
              *{" "}
              {error?.message ?? mutationError?.message ?? "GAGAL_MEMUAT_AKUN"}
            </p>
          )}


          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-background z-10">
                <tr className="border-b border-dotted border-outline-variant">
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    NAME
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    CURRENCY
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    BALANCE
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">
                    STATUS
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant hidden md:table-cell">
                    ORDER
                  </th>
                  <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-primary">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 px-4 text-center text-on-surface-variant"
                    >
                      LOADING_ACCOUNTS...
                    </td>
                  </tr>
                ) : (
                  accounts.map((acc) => {
                    const iconName = acc.icon ?? "wallet";
                    const color = resolveColor(acc.color);
                    const Icon = ICON_MAP[iconName] ?? Wallet;
                    return (
                      <tr
                        key={acc.accountId}
                        onClick={() => handleViewTransactions(acc.accountId)}
                        className="hover:bg-surface-variant transition-colors border-b border-dotted border-outline-variant last:border-b-0 cursor-pointer"
                        title="VIEW_TRANSACTIONS"
                      >
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="w-8 h-8 flex items-center justify-center shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              <Icon className="w-4 h-4 text-background" />
                            </span>
                            <span className="truncate" title={acc.name}>
                              {acc.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="border border-outline-variant px-2 py-1 text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                            {acc.currency}
                          </span>
                        </td>
                        <td
                          className="py-4 px-4 whitespace-nowrap truncate"
                          title={formatCurrency(acc.balance)}
                        >
                          {formatCurrency(acc.balance)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`border px-2 py-1 text-[10px] font-label-caps uppercase tracking-wider ${
                              acc.archived
                                ? "border-outline-variant text-on-surface-variant"
                                : "border-primary text-primary"
                            }`}
                          >
                            {acc.archived ? "ARCHIVED" : "ACTIVE"}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap hidden md:table-cell">
                          {acc.displayOrder}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewTransactions(acc.accountId);
                              }}
                              title="VIEW_TRANSACTIONS"
                              className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAccount(acc);
                              }}
                              disabled={updateAccount.isPending}
                              title="EDIT_ACCOUNT"
                              className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingAccount(acc);
                              }}
                              disabled={deleteAccount.isPending}
                              title="DELETE_ACCOUNT"
                              className="border border-outline-variant px-2 py-1 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                {!isLoading && accounts.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 px-4 text-center text-on-surface-variant"
                    >
                      NO_ACCOUNTS
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AccountFormModal
          isPending={createAccount.isPending}
          errorMessage={createAccount.error?.message}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {editingAccount && (
        <AccountFormModal
          account={editingAccount}
          isPending={updateAccount.isPending}
          errorMessage={updateAccount.error?.message}
          onClose={() => setEditingAccount(null)}
          onSubmit={handleSubmit}
        />
      )}

      {deletingAccount && (
        <ConfirmDialog
          title="DELETE_ACCOUNT"
          message={`Hapus akun "${deletingAccount.name}"? Tindakan ini permanen dan menghapus seluruh riwayat transaksi, pinjaman, dan pembayaran pinjaman yang terkait dengan akun ini.`}
          confirmLabel="DELETE"
          cancelLabel="CANCEL"
          isPending={deleteAccount.isPending}
          errorMessage={deleteAccount.error?.message}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingAccount(null)}
        />
      )}
    </>
  );
}



