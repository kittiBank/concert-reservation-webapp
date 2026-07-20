"use client";

import { useEffect } from "react";

interface AdminDeleteConcertModalProps {
  open: boolean;
  concertName: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteWarningIcon() {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F96464]">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </div>
  );
}

export function AdminDeleteConcertModal({
  open,
  concertName,
  loading = false,
  onCancel,
  onConfirm,
}: AdminDeleteConcertModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onCancel}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal
        aria-labelledby="delete-concert-title"
        className="relative z-10 w-full max-w-[420px] rounded-xl bg-white px-6 py-8 shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <DeleteWarningIcon />

          <h2
            id="delete-concert-title"
            className="mt-5 text-lg font-semibold text-[#111827]"
          >
            Are you sure to delete?
          </h2>

          <p className="mt-2 text-lg font-semibold text-[#111827]">
            &ldquo;{concertName}&rdquo;
          </p>

          <div className="mt-8 grid w-full grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="h-11 rounded-md border border-[#D1D5DB] bg-white text-sm font-medium text-[#111827] transition-colors hover:bg-[#F9FAFB] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#F96464] text-sm font-medium text-white transition-colors hover:bg-[#e85555] disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
