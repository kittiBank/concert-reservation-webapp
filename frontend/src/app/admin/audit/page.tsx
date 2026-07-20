"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState, Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api/client";
import { listAllReservations } from "@/lib/api/reservations";
import type { Reservation } from "@/types";

function AdminAuditContent() {
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
    <PageContainer
      title="Reservation Audit Trail"
      description="All user reservations across the system"
    >
      {loading ? (
        <Spinner />
      ) : reservations.length === 0 ? (
        <EmptyState
          title="No reservations yet"
          description="Reservations will appear here once users start booking."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-sm">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="px-4 py-3 font-medium text-surface-700">ID</th>
                  <th className="px-4 py-3 font-medium text-surface-700">User</th>
                  <th className="px-4 py-3 font-medium text-surface-700">Concert</th>
                  <th className="px-4 py-3 font-medium text-surface-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b border-surface-100 last:border-0"
                  >
                    <td className="px-4 py-3 text-surface-600">#{reservation.id}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-surface-900">
                        {reservation.user?.email ?? `User #${reservation.userId}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-700">
                      {reservation.concert.name}
                    </td>
                    <td className="px-4 py-3 text-surface-600">
                      {new Date(reservation.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-surface-300 px-4 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-surface-600">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-surface-300 px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}

export default function AdminAuditPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminAuditContent />
    </AuthGuard>
  );
}
