"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}
