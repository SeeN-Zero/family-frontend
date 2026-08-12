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
  TrendingUp,
  ShoppingCart,
  Home,
  Car,
  Heart,
  GraduationCap,
  Gift,
} from "lucide-react";
import type { ApiCategory, UpdateCategoryRequest } from "@/hooks/types";

type EditCategoryModalProps = {
  category: ApiCategory;
  onClose: () => void;
  onSubmit: (payload: UpdateCategoryRequest) => void;
};

const ICON_OPTIONS = [
  { name: "trending-up", icon: TrendingUp },
  { name: "shopping-cart", icon: ShoppingCart },
  { name: "home", icon: Home },
  { name: "car", icon: Car },
  { name: "heart", icon: Heart },
  { name: "graduation-cap", icon: GraduationCap },
  { name: "gift", icon: Gift },
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

function hexToColorName(hex: string | null): string {
  if (!hex) return "green";
  const normalized = hex.toUpperCase();
  return (
    COLOR_OPTIONS.find((opt) => opt.hex.toUpperCase() === normalized)?.name ??
    "green"
  );
}

export default function EditCategoryModal({
  category,
  onClose,
  onSubmit,
}: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon ?? "trending-up");
  const [color, setColor] = useState(hexToColorName(category.color));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const selectedColor = COLOR_OPTIONS.find((opt) => opt.name === color);
    onSubmit({
      name: name.trim().toUpperCase(),
      icon,
      color: selectedColor?.hex ?? category.color ?? "#22C55E",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-lg border border-primary bg-background p-6 md:p-8 bracket-corners">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
            * EDIT_CATEGORY
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
              htmlFor="edit-cat-name"
              className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
            >
              CATEGORY_NAME
            </label>
            <input
              id="edit-cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. TRANSPORTATION"
              required
              className="bg-background border border-outline-variant px-4 py-3 font-body-sm text-body-sm text-primary placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              ICON
            </label>
            <div className="grid grid-cols-7 gap-2">
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
              UPDATE_CATEGORY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
