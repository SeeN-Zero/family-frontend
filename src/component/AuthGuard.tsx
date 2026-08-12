"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { getAccessToken } from "@/lib/auth";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth-keys";

function getTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_TOKEN_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function hasValidSession(): boolean {
  return Boolean(getAccessToken() ?? getTokenFromCookie());
}

const subscribe = (onStoreChange: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("seen-family-auth", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("seen-family-auth", onStoreChange);
  };
};

const getSnapshot = (): boolean => {
  if (typeof window === "undefined") return false;
  return hasValidSession();
};

// getServerSnapshot = true → selama SSR/hydration React memakai nilai "sudah
// login", sehingga useEffect redirect TIDAK pernah menyala dengan snapshot
// palsu (getSnapshot baru dibaca client setelah hydration). Kalau user
// benar-benar belum login, React re-render dengan getSnapshot()=false setelah
// hydration dan redirect tetap terjadi — refresh tidak lagi salah lempar ke
// /login walaupun user masih punya sesi valid.
const getServerSnapshot = (): boolean => true;

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  // Redirect hanya boleh terjadi dari snapshot client (post-hydration).
  // getServerSnapshot=true di atas mencegah redirect palsu saat hydration.
  useEffect(() => {
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
