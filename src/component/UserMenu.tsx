"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { clearSession } from "@/lib/auth";
import { AUTH_USER_KEY } from "@/lib/auth-keys";

type AuthUser = {
  userId: string;
  email: string;
  name: string;
};

function subscribeAuthUser(onStoreChange: () => void): () => void {
  window.addEventListener("seen-family-auth", onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("seen-family-auth", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

const getAuthUserSnapshot = (): string | null =>
  localStorage.getItem(AUTH_USER_KEY);

const getServerAuthUserSnapshot = (): string | null => null;

function parseAuthUserSnapshot(snapshot: string | null): AuthUser | null {
  if (!snapshot) return null;

  try {
    return JSON.parse(snapshot) as AuthUser;
  } catch {
    return null;
  }
}

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const userSnapshot = useSyncExternalStore(
    subscribeAuthUser,
    getAuthUserSnapshot,
    getServerAuthUserSnapshot
  );
  const user = useMemo(
    () => parseAuthUserSnapshot(userSnapshot),
    [userSnapshot]
  );
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
    router.replace("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-2 border border-primary p-1 hover:bg-primary hover:text-background transition-colors cursor-pointer"
      >
        <span className="w-6 h-6 flex items-center justify-center bg-surface-variant text-[10px] font-label-caps uppercase">
          {user ? user.name.charAt(0).toUpperCase() : "?"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 border border-primary bg-surface shadow-[4px_4px_0px_0px_#303030]">
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

