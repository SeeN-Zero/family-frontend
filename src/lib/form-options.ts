// src/lib/form-options.ts
// Opsi icon/color bersama untuk form modal kategori & akun. Disentralisasi
// agar AddCategoryModal/EditCategoryModal/AccountFormModal tidak menduplikasi
// daftar dan fungsi konversi yang identik.

import {
  TrendingUp,
  ShoppingCart,
  Home,
  Car,
  Heart,
  GraduationCap,
  Gift,
  Wallet,
  Landmark,
  PiggyBank,
  CreditCard,
  Banknote,
  Coins,
} from "lucide-react";

export const COLOR_OPTIONS = [
  { name: "green", className: "bg-green-500", hex: "#22C55E" },
  { name: "blue", className: "bg-blue-500", hex: "#3B82F6" },
  { name: "yellow", className: "bg-yellow-500", hex: "#EAB308" },
  { name: "red", className: "bg-red-500", hex: "#EF4444" },
  { name: "purple", className: "bg-purple-500", hex: "#A855F7" },
  { name: "orange", className: "bg-orange-500", hex: "#F97316" },
];

export function hexToColorName(hex: string | null): string {
  if (!hex) return "green";
  const normalized = hex.toUpperCase();
  return (
    COLOR_OPTIONS.find((opt) => opt.hex.toUpperCase() === normalized)?.name ??
    "green"
  );
}

export const CATEGORY_ICON_OPTIONS = [
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

export const ACCOUNT_ICON_OPTIONS = [
  { name: "wallet", icon: Wallet },
  { name: "landmark", icon: Landmark },
  { name: "piggy-bank", icon: PiggyBank },
  { name: "credit-card", icon: CreditCard },
  { name: "banknote", icon: Banknote },
  { name: "coins", icon: Coins },
];
