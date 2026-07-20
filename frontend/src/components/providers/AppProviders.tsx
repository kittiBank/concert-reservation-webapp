"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { CloseFilledIcon } from "@/components/ui/CloseFilledIcon";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";
import "@/styles/sonner-overrides.css";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        style={{ "--width": "280px" } as React.CSSProperties}
        icons={{ close: <CloseFilledIcon /> }}
        toastOptions={{
          classNames: {
            closeButton: "toast-close-inline",
          },
        }}
      />
    </AuthProvider>
  );
}
