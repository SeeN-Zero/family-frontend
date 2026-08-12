// src/app/(main)/layout.tsx
import AppHeader from "@/component/AppHeader";
import AuthGuard from "@/component/AuthGuard";
import Footer from "@/component/Footer";
import Sidebar from "@/component/Sidebar";

// Sesi disimpan di localStorage (lihat src/lib/auth.ts), sehingga server TIDAK
// bisa memverifikasinya lewat cookie. Redirect server-side yang hanya mengecek
// cookie (mis. cookie `seen_family_token` sudah kedaluwarsa padahal token di
// localStorage masih valid) membuat halaman selalu terlempar ke /login saat
// di-refresh. Gate auth sepenuhnya ditangani AuthGuard di sisi client.
export const dynamic = "force-dynamic";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppHeader />

      <div className="flex flex-1 h-full min-h-0 w-full relative overflow-hidden pt-16 pb-14">
        <Sidebar />
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      <Footer
        copyrightText="©2026 SEEN FAMILY"
        links={[{ label: "SEEN_DEV", href: "#" }]}
      />
    </AuthGuard>
  );
}