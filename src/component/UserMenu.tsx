"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, ChevronDown } from "lucide-react";
import { clearSession } from "@/lib/auth";
import { useUserAccount } from "@/hooks/useUserAccount";

export default function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: user } = useUserAccount();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    clearSession();
    queryClient.clear();
    router.replace("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-1 md:gap-2 border border-primary p-2.5 hover:bg-primary hover:text-background transition-colors cursor-pointer"
      >
        <span className="w-6 h-6 flex items-center justify-center bg-surface-variant font-label-caps text-label-caps uppercase">
          {user ? user.name.charAt(0).toUpperCase() : "?"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 max-w-[calc(100vw-2rem)] border border-primary bg-surface shadow-[4px_4px_0px_0px_#303030] z-50">
          <div className="border-b border-dotted border-outline-variant px-4 py-3">
            <p className="font-label-caps text-label-caps text-primary uppercase truncate">
              {user?.name ?? "UNKNOWN_USER"}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {user?.email ?? "—"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider hover:bg-primary hover:text-background transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
}

