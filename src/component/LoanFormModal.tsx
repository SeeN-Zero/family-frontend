"use client";

import { useState } from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import { formatRupiah, parseRupiah } from "@/lib/currency";
import { todayISO } from "@/lib/date";
import { useCreateContact } from "@/hooks/useContactMutations";
import ContactFormModal from "@/component/ContactFormModal";
import type {
  ApiAccount,
  ApiContact,
  CreateContactRequest,
  CreateLoanRequest,
  LoanType,
} from "@/hooks/types";

type LoanFormModalProps = {
  accounts: ApiAccount[];
  contacts: ApiContact[];
  defaultType: LoanType;
  isPending?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSubmit: (payload: CreateLoanRequest) => void;
};

export default function LoanFormModal({
  accounts,
  contacts,
  defaultType,
  isPending = false,
  errorMessage,
  onClose,
  onSubmit,
}: LoanFormModalProps) {
  const [contactId, setContactId] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState<LoanType>(defaultType);
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState("");

  const createContact = useCreateContact();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatRupiah(e.target.value));
  };

  const handleCreateContact = (payload: CreateContactRequest) => {
    createContact.mutate(payload, {
      onSuccess: (created) => {
        setContactId(created.contactId);
        setNewContactName(created.name);
        setIsAddContactOpen(false);
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawAmount = Number(parseRupiah(amount));
    if (!contactId || !accountId || !rawAmount || !transactionDate) return;

    const payload: CreateLoanRequest = {
      contactId,
      accountId,
      loanType: type,
      amount: rawAmount,
      transactionDate,
      dueDate: dueDate || undefined,
    };
    onSubmit(payload);
    onClose();
  };

  const selectedContactName =
    contacts.find((c) => c.contactId === contactId)?.name ?? newContactName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
            * NEW_LOAN_ENTRY
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

        {(errorMessage || createContact.error?.message) && (
          <p className="border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider mb-6">
            * {errorMessage ?? createContact.error?.message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="loan-type"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              TYPE
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("DEBT")}
                disabled={isPending}
                className={`px-4 py-2 font-label-caps text-label-caps uppercase tracking-wider transition-colors cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed ${
                  type === "DEBT"
                    ? "bg-primary text-background border-primary"
                    : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                }`}
              >
                DEBT
              </button>
              <button
                type="button"
                onClick={() => setType("RECEIVABLE")}
                disabled={isPending}
                className={`px-4 py-2 font-label-caps text-label-caps uppercase tracking-wider transition-colors cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed ${
                  type === "RECEIVABLE"
                    ? "bg-primary text-background border-primary"
                    : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                }`}
              >
                RECEIVABLE
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="loan-contact"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              CONTACT
            </label>
            <div className="flex items-stretch gap-2">
              <div className="relative flex-1 min-w-0">
                <button
                  type="button"
                  id="loan-contact"
                  onClick={() => setIsContactOpen(!isContactOpen)}
                  disabled={isPending}
                  className="w-full bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors flex items-center justify-between cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className={contactId ? "" : "text-outline"}>
                    {selectedContactName || "SELECT_CONTACT"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0" />
                </button>

                {isContactOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsContactOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 border border-primary bg-background z-50 max-h-48 overflow-y-auto">
                      {contacts.length === 0 && (
                        <div className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
                          NO_CONTACTS
                        </div>
                      )}
                      {contacts.map((contact) => (
                        <button
                          key={contact.contactId}
                          type="button"
                          onClick={() => {
                            setContactId(contact.contactId);
                            setIsContactOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 font-body-sm text-body-sm transition-colors cursor-pointer text-left ${
                            contactId === contact.contactId
                              ? "bg-surface-variant text-primary"
                              : "text-primary hover:bg-surface-variant"
                          }`}
                        >
                          <span className="w-6 h-6 flex items-center justify-center bg-primary shrink-0">
                            <span className="font-label-caps text-label-caps text-background">
                              {contact.name.charAt(0).toUpperCase()}
                            </span>
                          </span>
                          <span className="truncate">{contact.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsAddContactOpen(true)}
                disabled={isPending}
                className="border border-primary px-4 font-label-caps text-label-caps text-primary bg-background hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                ADD_CONTACT
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="loan-account"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              AFFECTED_ACCOUNT
            </label>
            <select
              id="loan-account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
              disabled={isPending}
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-40"
            >
              <option value="" disabled>
                SELECT_ACCOUNT
              </option>
              {accounts.map((acc) => (
                <option key={acc.accountId} value={acc.accountId}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="loan-amount"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
              >
                AMOUNT (RP)
              </label>
              <input
                id="loan-amount"
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
                htmlFor="loan-date"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
              >
                TRANSACTION_DATE
              </label>
              <input
                id="loan-date"
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
                disabled={isPending}
                className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="loan-due-date"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              DUE_DATE (OPTIONAL)
            </label>
            <input
              id="loan-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isPending}
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
            />
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
              disabled={isPending}
              className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "SAVING..." : "SAVE_ENTRY"}
            </button>
          </div>
        </form>
      </div>

      {isAddContactOpen && (
        <ContactFormModal
          isPending={createContact.isPending}
          errorMessage={createContact.error?.message}
          onClose={() => setIsAddContactOpen(false)}
          onSubmit={handleCreateContact}
        />
      )}
    </div>
  );
}

