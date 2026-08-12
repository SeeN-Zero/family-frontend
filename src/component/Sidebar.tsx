"use client";

import Link from "next/link";
import {
  Terminal,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Receipt,
  HandCoins,
  Tags,
  ContactRound,
} from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar-store";

const MENU_ITEMS = [
  { label: "DASHBOARD", icon: Terminal, href: "/dashboard" },
  { label: "TRANSACTION", icon: Receipt, href: "/transaction" },
  { label: "LOAN", icon: HandCoins, href: "/loan" },
  { label: "ACCOUNT", icon: Wallet, href: "/account" },
  { label: "CATEGORY", icon: Tags, href: "/category" },
  { label: "CONTACT", icon: ContactRound, href: "/contact" },
  { label: "SETTINGS", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={`shrink-0 border-r-2 border-dotted border-outline bg-background h-full flex flex-col overflow-hidden transition-[width] duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b-2 border-dotted border-outline">
        {!isCollapsed && (
          <span className="font-label-caps text-label-caps text-primary uppercase whitespace-nowrap">
            System Menu
          </span>
        )}
        <button
          onClick={toggle}
          className="text-primary hover:bg-primary hover:text-background transition-colors shrink-0 w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-2 p-2 mt-4">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-variant hover:text-primary p-2 transition-colors cursor-pointer"
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="font-label-caps text-label-caps whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
