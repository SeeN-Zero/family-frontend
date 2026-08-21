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
    <>
      {/* Mobile: Fixed bottom navigation — nempel di atas footer fixed.
          Footer mobile height ~40px (py-3 +), jadi nav pakai bottom-10
          (40px) supaya rapat, tidak ada celah kosong. */}
      <nav className="md:hidden fixed bottom-10 left-0 right-0 z-30 bg-background border-t-2 border-dotted border-outline">
        <div className="flex items-stretch justify-between px-1 py-1 gap-0.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 text-on-surface-variant hover:text-primary py-1.5 transition-colors cursor-pointer flex-1 min-w-0"
                title={item.label}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-label-caps text-label-caps uppercase tracking-wider truncate w-full text-center px-0.5">
                  {item.label.slice(0, 4)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: Side navigation */}
      <aside
        className={`hidden md:flex shrink-0 border-r-2 border-dotted border-outline bg-background md:sticky md:top-16 md:h-[calc(100dvh-4rem)] flex-col overflow-y-auto transition-[width] duration-300 ${
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
    </>
  );
}
