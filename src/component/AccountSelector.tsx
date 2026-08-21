// src/component/AccountSelector.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import type { ApiAccount } from "@/hooks/types";

type AccountSelectorProps = {
  accounts: ApiAccount[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
};


export default function AccountSelector({
  accounts,
  selectedId,
  onSelect,
  disabled = false,
}: AccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mountedOnceRef = useRef(false);

  // Server HTML (static prerender) punya `accounts` terisi, sedangkan client
  // saat hydration masih kosong (query belum resolve). Supaya teks & atribut
  // cocok saat hydration, render placeholder statis sampai mounted; isi asli
  // baru muncul setelah mount (state update normal, bukan mismatch).
  useEffect(() => {
    if (!mountedOnceRef.current) {
      mountedOnceRef.current = true;
      setIsMounted(true);
    }
  }, []);

  const selectedAccount = accounts.find((acc) => acc.accountId === selectedId);

  const isAllSelected = selectedId === "ALL";
  const displayName = isMounted
    ? isAllSelected
      ? "TOTAL ACCOUNT"
      : selectedAccount?.name ?? "NO_ACCOUNT"
    : isAllSelected
      ? "TOTAL ACCOUNT"
      : "";
  const displayBalance = isMounted
    ? isAllSelected
      ? accounts
          .filter((acc) => !acc.archived)
          .reduce((sum, acc) => sum + acc.balance, 0)
      : selectedAccount?.balance ?? 0
    : 0;

  // `disabled` hanya dari prop (sudah digate `mounted` oleh parent), TIDAK
  // dari `accounts.length` — jumlah akun berbeda antara SSR vs client
  // hydration, sehingga atribut `disabled` jadi mismatch.
  const isDisabled = disabled;

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isDisabled}
        className="border border-primary bg-primary text-background p-4 w-full text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <div className="flex justify-between items-center gap-3">
          <span className="font-label-caps text-label-caps truncate">
            {displayName}
          </span>
          <ChevronDown
            className={`w-4 h-4 shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        <div className="mt-2 font-display-lg text-headline-md">
          {formatCurrency(displayBalance)}
        </div>
      </button>

      {isOpen && isMounted && !isDisabled && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full left-0 mt-2 w-full border border-primary bg-background z-40 max-h-80 overflow-y-auto">
            {/* ALL option */}
            <button
              type="button"
              onClick={() => {
                onSelect("ALL");
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-surface-variant transition-colors cursor-pointer border-b border-outline-variant bg-background"
            >
              <div className="min-w-0">
                <div className="font-label-caps text-label-caps text-on-surface-variant truncate">
                  TOTAL ACCOUNT
                </div>
                <div className="font-display-lg text-body-lg text-primary mt-1">
                  {formatCurrency(
                    accounts
                      .filter((acc) => !acc.archived)
                      .reduce((sum, acc) => sum + acc.balance, 0)
                  )}
                </div>
              </div>
              {isAllSelected && (
                <Check className="w-4 h-4 text-primary shrink-0" />
              )}
            </button>

            {/* Individual accounts */}
            {accounts.map((acc) => (
              <button
                key={acc.accountId}
                type="button"
                onClick={() => {
                  onSelect(acc.accountId);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-surface-variant transition-colors cursor-pointer border-b border-outline-variant last:border-b-0 bg-background"
              >
                <div className="min-w-0">
                  <div className="font-label-caps text-label-caps text-on-surface-variant truncate">
                    {acc.name}
                  </div>
                  <div className="font-display-lg text-body-lg text-primary mt-1">
                    {formatCurrency(acc.balance)}
                  </div>
                </div>
                {acc.accountId === selectedId && (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

