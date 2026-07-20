"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api/client";
import {
  cancelReservation,
  listMyReservations,
} from "@/lib/api/reservations";
import type { Reservation } from "@/types";

function MyReservationsContent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listMyReservations({ pageSize: 50 });
      setReservations(response.data);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load reservations";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    try {
      await cancelReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reservation cancelled");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to cancel reservation";
      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <PageContainer
      title="My Reservations"
      description="View and manage your concert bookings"
    >
      {loading ? (
        <Spinner />
      ) : reservations.length === 0 ? (
        <EmptyState
          title="No reservations yet"
          description="Browse concerts and reserve your first seat."
          action={
            <Link href="/concerts">
              <Button>Browse Concerts</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="flex flex-col gap-4 rounded-xl border border-surface-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-semibold text-surface-900">
                    {reservation.concert.name}
                  </h3>
                  {reservation.concert.isSoldOut && (
                    <Badge variant="danger">Sold Out</Badge>
                  )}
                </div>
                <p className="mb-2 line-clamp-1 text-sm text-surface-600">
                  {reservation.concert.description}
                </p>
                <p className="text-xs text-surface-500">
                  Reserved on{" "}
                  {new Date(reservation.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={`/concerts/${reservation.concertId}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  loading={cancellingId === reservation.id}
                  onClick={() => handleCancel(reservation.id)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default function MyReservationsPage() {
  return (
    <AuthGuard>
      <MyReservationsContent />
    </AuthGuard>
  );
}
