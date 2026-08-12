// src/lib/auth.ts
"use client";

import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTH_TOKEN_COOKIE,
} from "./auth-keys";

const AUTH_EVENT = "seen-family-auth";
const TOKEN_COOKIE = AUTH_TOKEN_COOKIE;

export type AuthUser = {
  userId: string;
  email: string;
  name: string;
};

export type GoogleAuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  name: string;
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

function setTokenCookie(value: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearTokenCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

function emitAuthEvent(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const local = localStorage.getItem(AUTH_TOKEN_KEY);
  if (local) return local;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function setSession(data: GoogleAuthResponse): void {
  localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      userId: data.userId,
      email: data.email,
      name: data.name,
    } as AuthUser)
  );
  setTokenCookie(data.accessToken, data.expiresIn > 0 ? data.expiresIn : 60 * 60);
  emitAuthEvent();
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  clearTokenCookie();
  emitAuthEvent();
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function loginWithGoogle(
  idToken: string
): Promise<GoogleAuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    let message = "PERMINTAAN_TIDAK_VALID";
    if (res.status === 400) message = "PERMINTAAN_TIDAK_VALID";
    else if (res.status === 401) message = "TOKEN_GOOGLE_TIDAK_VALID";
    else if (res.status === 403) message = "AKUN_TIDAK_AKTIF";
    throw new Error(message);
  }

  return (await res.json()) as GoogleAuthResponse;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401) {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
    throw new Error("TIDAK_TEROTENTIKASI");
  }

  if (!res.ok) {
    // Coba baca pesan error dari body JSON (mis. {"code":"...","message":"..."}).
    let message = `REQUEST_FAILED_${res.status}`;
    try {
      const body = await res.json();
      if (body && typeof body.message === "string" && body.message.trim()) {
        message = body.message;
      } else if (body && typeof body.error === "string" && body.error.trim()) {
        message = body.error;
      }
    } catch {
      // Body bukan JSON / kosong — pakai fallback.
    }
    throw new Error(message);
  }

  // DELETE (dan endpoint lain yang mengembalikan 204 No Content / body kosong)
  // tidak boleh dipaksa di-parse sebagai JSON.
  const contentType = res.headers.get("content-type") ?? "";
  if (res.status === 204 || !contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
