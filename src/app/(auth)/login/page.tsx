"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { loginWithGoogle, setSession, safeInternalRedirect } from "@/lib/auth";
import { loginSchema, type LoginRequest } from "@/features/auth/schemas";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (resp: { credential: string }) => void;
          }) => void;
          prompt: () => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "small" | "medium" | "large";
              shape?: "rectangular" | "pill";
              text?: "continue_with" | "signin_with" | "signup_with";
              width?: number;
              logo_alignment?: "left" | "center";
            }
          ) => void;
        };
      };
    };
    __gsiInitialized?: boolean;
  }
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

type GsiInstance = {
  initialize: (config: {
    client_id: string;
    callback: (resp: { credential: string }) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "small" | "medium" | "large";
      shape?: "rectangular" | "pill";
      text?: "continue_with" | "signin_with" | "signup_with";
      width?: number;
      logo_alignment?: "left" | "center";
    }
  ) => void;
};

function getGsi(): GsiInstance | null {
  return window.google?.accounts?.id ?? null;
}

function loadGsiScript(): Promise<GsiInstance | null> {
  return new Promise((resolve) => {
    const existing = getGsi();
    if (existing) {
      resolve(existing);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(getGsi()), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(null), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(getGsi());
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { reset } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: { idToken: "" },
  });
  const gsiRef = useRef<GsiInstance | null>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const handleCredential = async (resp: { credential: string }) => {
      const parsed = loginSchema.safeParse({ idToken: resp.credential });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "TOKEN_GOOGLE_TIDAK_VALID");
        return;
      }
      reset(parsed.data);
      setIsLoading(true);
      setError(null);
      try {
        const auth = await loginWithGoogle(parsed.data.idToken);
        setSession(auth);
        const redirect = searchParams.get("redirect");
        router.replace(safeInternalRedirect(redirect));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "TERJADI_KESALAHAN_TIDAK_DIKETAHUI"
        );
        setIsLoading(false);
      }
    };

    async function init() {
      if (!GOOGLE_CLIENT_ID) {
        setError("GOOGLE_CLIENT_ID_TIDAK_DIKONFIGURASI");
        return;
      }

      const gsi = await loadGsiScript();
      if (cancelled || !gsi) {
        if (!cancelled) setError("PAKET_GOOGLE_LOGIN_GAGAL_DIMUAT");
        return;
      }

      gsiRef.current = gsi;

      if (!window.__gsiInitialized) {
        window.__gsiInitialized = true;
        gsi.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredential,
        });
      }

      setGsiReady(true);
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams, reset]);

  // Render built-in Google button (proven to work) themed & centered.
  useEffect(() => {
    const container = buttonContainerRef.current;
    const gsi = gsiRef.current;
    if (!gsiReady || !gsi || !container) return;

    container.innerHTML = "";
    const width = Math.min(container.clientWidth || 320, 320);
    gsi.renderButton(container, {
      theme: "filled_black",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width,
    });
  }, [gsiReady]);

  return (
    <>
      <Header title="SEEN FAMILY" />
      <main className="pixel-dither-bg flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop relative z-10">
        <div className="bracket-corners relative w-full max-w-md">
          <div className="bracket-corners-inner">
            <div className="border-2 border-primary bg-surface p-8 md:p-12 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_#303030]">
              <div className="text-center mb-12 w-full">
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase tracking-tighter mb-4">
                  SEEN FAMILY FINANCE SYSTEM
                </h1>

                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-center gap-2">
                  {isLoading ? "AUTHENTICATING" : gsiReady ? "AWAITING" : "LOADING"}
                  <span className="inline-block w-2 h-4 bg-primary cursor-blink" />
                </p>
              </div>

              <div className="w-full flex flex-col items-center gap-4">
                {error && (
                  <p className="w-full border border-primary bg-surface px-4 py-3 font-label-caps text-label-caps text-primary uppercase tracking-wider text-center">
                    * {error}
                  </p>
                )}

                <div className="relative w-full max-w-[320px] min-h-[48px] flex items-center justify-center">
                  {isLoading ? (
                    <div className="w-full flex items-center justify-center border-2 border-primary bg-surface text-primary px-6 py-4 shadow-[4px_4px_0px_0px_#303030]">
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      <span className="font-label-caps text-label-caps uppercase tracking-wider">
                        PROCESSING...
                      </span>
                    </div>
                  ) : gsiReady ? (
                    <div className="w-full flex justify-center">
                      <div className="border-2 border-primary bg-surface p-1.5 shadow-[4px_4px_0px_0px_#303030]">
                        <div
                          ref={buttonContainerRef}
                          className="w-[320px] max-w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center border-2 border-primary bg-surface text-primary px-6 py-4 shadow-[4px_4px_0px_0px_#303030]">
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      <span className="font-label-caps text-label-caps uppercase tracking-wider">
                        LOADING GOOGLE BUTTON...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 w-full flex justify-between items-end border-t border-dotted border-outline-variant pt-4">
                <span className="font-body-sm text-body-sm text-outline-variant text-[10px]">
                  SYS_STATUS: ONLINE
                </span>

                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary" />
                  <div className="w-2 h-2 bg-outline-variant border border-primary" />
                  <div className="w-2 h-2 bg-outline-variant border border-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer copyrightText="©2026 SEEN FAMILY" />
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="pixel-dither-bg flex-grow flex items-center justify-center">
          <div className="border-2 border-primary bg-surface p-8 text-primary font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            LOADING...
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}