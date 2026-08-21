// src/app/(main)/layout.tsx
import AppHeader from "@/component/AppHeader";
import AuthGuard from "@/component/AuthGuard";
import Footer from "@/component/Footer";
import Sidebar from "@/component/Sidebar";

// Sesi disimpan di localStorage (lihat src/lib/auth.ts), sehingga server TIDAK
// bisa memverifikasinya lewat cookie. Gate auth sepenuhnya ditangani AuthGuard
// di sisi client; layout ini tidak melakukan pengecekan server apa pun sehingga
// tidak perlu memaksa dynamic rendering.

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppHeader />

      <div className="flex flex-col md:flex-row flex-1 min-h-0 md:h-[calc(100dvh-4rem)] w-full relative pt-16">
        <Sidebar />
        <main className="flex-1 min-w-0 min-h-0 md:overflow-y-auto overflow-x-hidden pb-32 md:pb-14">
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