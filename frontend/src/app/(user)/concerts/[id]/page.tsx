"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import { getConcert } from "@/lib/api/concerts";
import {
  cancelReservation,
  createReservation,
  listMyReservations,
} from "@/lib/api/reservations";
import type { Concert, Reservation } from "@/types";

function ConcertDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const concertId = Number(params.id);

  const [concert, setConcert] = useState<Concert | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (Number.isNaN(concertId)) {
      router.replace("/concerts");
      return;
    }

    setLoading(true);
    try {
      const [concertData, reservationsData] = await Promise.all([
        getConcert(concertId),
        !isAdmin ? listMyReservations({ pageSize: 100 }) : Promise.resolve(null),
      ]);

      setConcert(concertData);

      if (reservationsData) {
        const existing = reservationsData.data.find(
          (r) => r.concertId === concertId,
        );
        setReservation(existing ?? null);
      }
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load concert";
      toast.error(message);
      router.replace("/concerts");
    } finally {
      setLoading(false);
    }
  }, [concertId, isAdmin, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReserve = async () => {
    setActionLoading(true);
    try {
      const newReservation = await createReservation({ concertId });
      setReservation(newReservation);
      setConcert((prev) =>
        prev
          ? {
              ...prev,
              reservedCount: prev.reservedCount + 1,
              availableSeats: prev.availableSeats - 1,
              isSoldOut: prev.availableSeats - 1 <= 0,
            }
          : prev,
      );
      toast.success("Seat reserved successfully!");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to reserve seat";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;
    setActionLoading(true);
    try {
      await cancelReservation(reservation.id);
      setReservation(null);
      setConcert((prev) =>
        prev
          ? {
              ...prev,
              reservedCount: prev.reservedCount - 1,
              availableSeats: prev.availableSeats + 1,
              isSoldOut: false,
            }
          : prev,
      );
      toast.success("Reservation cancelled");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to cancel reservation";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!concert) return null;

  return (
    <PageContainer>
      <Link
        href="/concerts"
        className="mb-6 inline-flex items-center text-sm text-brand-600 hover:underline"
      >
        ← Back to concerts
      </Link>

      <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-surface-900 sm:text-3xl">
            {concert.name}
          </h1>
          {concert.isSoldOut ? (
            <Badge variant="danger">Sold Out</Badge>
          ) : (
            <Badge variant="success">{concert.availableSeats} seats available</Badge>
          )}
        </div>

        <p className="mb-8 text-surface-600">{concert.description}</p>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-surface-50 p-4">
            <p className="text-sm text-surface-500">Total Seats</p>
            <p className="text-2xl font-bold text-surface-900">
              {concert.totalSeats}
            </p>
          </div>
          <div className="rounded-lg bg-surface-50 p-4">
            <p className="text-sm text-surface-500">Booked</p>
            <p className="text-2xl font-bold text-surface-900">
              {concert.reservedCount}
            </p>
          </div>
          <div className="rounded-lg bg-surface-50 p-4">
            <p className="text-sm text-surface-500">Available</p>
            <p className="text-2xl font-bold text-brand-600">
              {concert.availableSeats}
            </p>
          </div>
        </div>

        {!isAdmin && (
          <div className="border-t border-surface-200 pt-6">
            {reservation ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-surface-600">
                  You have a reservation for this concert (ID: #{reservation.id})
                </p>
                <Button
                  variant="danger"
                  loading={actionLoading}
                  onClick={handleCancel}
                >
                  Cancel Reservation
                </Button>
              </div>
            ) : concert.isSoldOut ? (
              <p className="text-sm font-medium text-red-600">
                This concert is fully booked.
              </p>
            ) : (
              <Button loading={actionLoading} onClick={handleReserve} size="lg">
                Reserve a Seat
              </Button>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default function ConcertDetailPage() {
  return <ConcertDetailContent />;
}
