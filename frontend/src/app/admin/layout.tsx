"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAdmin>
      <div className="flex h-screen overflow-hidden font-[family-name:var(--font-roboto)]">
        <AdminSidebar />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#F5F5F5] pb-[72px] md:overflow-hidden md:pb-0">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
