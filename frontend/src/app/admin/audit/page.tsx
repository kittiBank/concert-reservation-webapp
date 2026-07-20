"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHistoryTable } from "@/components/admin/AdminHistoryTable";
import { EmptyState, Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api/client";
import { listAllReservations } from "@/lib/api/reservations";
import type { Reservation } from "@/types";

export default function AdminAuditPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAudit = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listAllReservations({ page, pageSize: 20 });
      setReservations(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load audit trail";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {loading ? (
        <Spinner />
      ) : reservations.length === 0 ? (
        <EmptyState
          title="No reservations yet"
          description="Reservations will appear here once users start booking."
        />
      ) : (
        <>
          <AdminHistoryTable reservations={reservations} />

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-[#D1D5DB] px-4 py-2 text-sm text-[#374151] disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-[#6B7280]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-[#D1D5DB] px-4 py-2 text-sm text-[#374151] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
