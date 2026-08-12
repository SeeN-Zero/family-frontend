"use client";

import { usePathname } from "next/navigation";
import {
  Terminal,
  Receipt,
  BarChart3,
  Wallet,
  Settings,
  HandCoins,
  Tags,
  ContactRound,
} from "lucide-react";
import Header from "@/component/Header";
import UserMenu from "@/component/UserMenu";

const HEADER_CONFIG = [
  { path: "/dashboard", label: "DASHBOARD", icon: Terminal },
  { path: "/transaction", label: "TRANSACTION", icon: Receipt },
  { path: "/category", label: "CATEGORY", icon: Tags },
  { path: "/contact", label: "CONTACT", icon: ContactRound },
  { path: "/loan", label: "LOAN", icon: HandCoins },
  { path: "/reports", label: "REPORTS", icon: BarChart3 },
  { path: "/budgets", label: "BUDGETS", icon: Wallet },
  { path: "/settings", label: "SETTINGS", icon: Settings },
];

export default function AppHeader() {
  const pathname = usePathname();
  const current =
    HEADER_CONFIG.find((item) => pathname.startsWith(item.path)) ??
    HEADER_CONFIG[0];

  return (
    <Header
      title={current.label}
      icon={current.icon}
      rightSlot={<UserMenu />}
    />
  );
}