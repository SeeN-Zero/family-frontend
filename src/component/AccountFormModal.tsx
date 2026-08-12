"use client";

import { useState } from "react";
import {
  X,
  Wallet,
  Landmark,
  PiggyBank,
  CreditCard,
  Banknote,
  Coins,
  Check,
} from "lucide-react";
import type {
  ApiAccount,
  CreateAccountRequest,
  CurrencyCode,
  UpdateAccountRequest,
} from "@/hooks/types";

type AccountFormModalProps = {
  // Ada `account` = mode edit (UpdateAccountRequest), tanpa `account` = mode create
  // (CreateAccountRequest).
  account?: ApiAccount;
  onClose: () => void;
  onSubmit: (payload: CreateAccountRequest | UpdateAccountRequest) => void;
};

const ICON_OPTIONS = [
  { name: "wallet", icon: Wallet },
  { name: "landmark", icon: Landmark },
  { name: "piggy-bank", icon: PiggyBank },
  { name: "credit-card", icon: CreditCard },
  { name: "banknote", icon: Banknote },
  { name: "coins", icon: Coins },
];

const COLOR_OPTIONS = [
  { name: "green", className: "bg-green-500", hex: "#22C55E" },
  { name: "blue", className: "bg-blue-500", hex: "#3B82F6" },
  { name: "yellow", className: "bg-yellow-500", hex: "#EAB308" },
  { name: "red", className: "bg-red-500", hex: "#EF4444" },
  { name: "purple", className: "bg-purple-500", hex: "#A855F7" },
  { name: "orange", className: "bg-orange-500", hex: "#F97316" },
];

const CURRENCY_OPTIONS: CurrencyCode[] = ["IDR"];

function hexToColorName(hex: string | null): string {
  if (!hex) return "green";
  const normalized = hex.toUpperCase();
  return (
    COLOR_OPTIONS.find((opt) => opt.hex.toUpperCase() === normalized)?.name ??
    "green"
  );
}

export default function AccountFormModal({
  account,
  onClose,
  onSubmit,
}: AccountFormModalProps) {
  const isEdit = Boolean(account);
  const [name, setName] = useState(account?.name ?? "");
  const [currency, setCurrency] = useState<CurrencyCode>(
    account?.currency ?? "IDR"
  );
  const [icon, setIcon] = useState(account?.icon ?? "wallet");
  const [color, setColor] = useState(hexToColorName(account?.color ?? null));
  const [displayOrder, setDisplayOrder] = useState(
    account ? String(account.displayOrder ?? 0) : "0"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedColor = COLOR_OPTIONS.find((opt) => opt.name === color);
    const hexColor = selectedColor?.hex ?? account?.color ?? "#22C55E";
    const order = Number(displayOrder);
    const parsedOrder = Number.isFinite(order) ? order : account?.displayOrder;

    if (isEdit) {
      const payload: UpdateAccountRequest = {
        name: name.trim().toUpperCase(),
        currency,
        // Endpoint memakai PUT yang me-replace seluruh field: selalu ikutkan
        // icon & color supaya tidak hilang saat edit.
        icon,
        color: hexColor,
        displayOrder: parsedOrder,
      };
      onSubmit(payload);
    } else {
      const payload: CreateAccountRequest = {
        name: name.trim().toUpperCase(),
        currency,
        icon,
        color: hexColor,
      };
      onSubmit(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
            {isEdit ? "* EDIT_ACCOUNT" : "* NEW_ACCOUNT"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-outline-variant hover:text-primary transition-colors cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="acc-name"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              ACCOUNT_NAME
            </label>
            <input
              id="acc-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MAIN_SAVINGS"
              maxLength={50}
              required
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="acc-currency"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              CURRENCY
            </label>
            <select
              id="acc-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {CURRENCY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {isEdit && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="acc-order"
                className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
              >
                DISPLAY_ORDER
              </label>
              <input
                id="acc-order"
                type="number"
                min={0}
                step={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              ICON
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = icon === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setIcon(opt.name)}
                    className={`flex items-center justify-center aspect-square border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-background border-primary"
                        : "bg-background text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              COLOR
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((opt) => {
                const isSelected = color === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setColor(opt.name)}
                    className={`aspect-square border-2 transition-colors cursor-pointer flex items-center justify-center ${opt.className} ${
                      isSelected
                        ? "border-primary"
                        : "border-transparent hover:border-outline-variant"
                    }`}
                  >
                    {isSelected && <Check className="w-5 h-5 text-background" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface-variant bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="border border-primary px-4 py-2 font-label-caps text-label-caps text-background bg-primary hover:bg-background hover:text-primary transition-colors cursor-pointer"
            >
              {isEdit ? "UPDATE_ACCOUNT" : "CREATE_ACCOUNT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

