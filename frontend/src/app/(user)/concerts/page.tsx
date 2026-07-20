"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserConcertOverviewList } from "@/components/concerts/UserConcertOverviewList";
import { CheckCircleIcon } from "@/components/ui/CheckCircleIcon";
import { EmptyState, Spinner } from "@/components/ui/Spinner";
import { dedupeRequest } from "@/lib/api/dedupe";
import { ApiError } from "@/lib/api/client";
import { listConcerts } from "@/lib/api/concerts";
import {
  cancelReservation,
  createReservation,
  listMyReservations,
} from "@/lib/api/reservations";
import type { Concert } from "@/types";

async function loadUserHomeData() {
  const [concertsResponse, reservationsResponse] = await Promise.all([
    listConcerts({ pageSize: 50 }),
    listMyReservations({ pageSize: 100 }),
  ]);

  return { concertsResponse, reservationsResponse };
}

function buildReservationsMap(
  reservations: Awaited<
    ReturnType<typeof listMyReservations>
  >["data"],
): Record<number, number> {
  return Object.fromEntries(
    reservations.map((reservation) => [reservation.concertId, reservation.id]),
  );
}

export default function ConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservationsByConcertId, setReservationsByConcertId] = useState<
    Record<number, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [actionConcertId, setActionConcertId] = useState<number | null>(null);

  const refreshData = useCallback(async () => {
    const { concertsResponse, reservationsResponse } = await loadUserHomeData();
    setConcerts(concertsResponse.data);
    setReservationsByConcertId(
      buildReservationsMap(reservationsResponse.data),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);

      try {
        const { concertsResponse, reservationsResponse } = await dedupeRequest(
          "user-concerts-home",
          loadUserHomeData,
        );

        if (cancelled) return;

        setConcerts(concertsResponse.data);
        setReservationsByConcertId(
          buildReservationsMap(reservationsResponse.data),
        );
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof ApiError ? err.message : "Failed to load concerts";
        toast.error(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleReserve = async (concertId: number) => {
    setActionConcertId(concertId);
    try {
      await createReservation({ concertId });
      toast.success("Reserve successfully", {
        icon: <CheckCircleIcon />,
      });
      await refreshData();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to reserve seat";
      toast.error(message);
    } finally {
      setActionConcertId(null);
    }
  };

  const handleCancel = async (concertId: number, reservationId: number) => {
    setActionConcertId(concertId);
    try {
      await cancelReservation(reservationId);
      toast.success("Cancel successfully", {
        icon: <CheckCircleIcon />,
      });
      await refreshData();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to cancel reservation";
      toast.error(message);
    } finally {
      setActionConcertId(null);
    }
  };

  return (
    <div className="flex flex-col p-3 sm:p-4 md:h-full md:min-h-0 md:overflow-hidden md:p-6">
      {loading ? (
        <Spinner />
      ) : concerts.length === 0 ? (
        <EmptyState
          title="No concerts yet"
          description="Check back later for upcoming events."
        />
      ) : (
        <div className="md:min-h-0 md:flex-1 md:overflow-hidden">
          <UserConcertOverviewList
            concerts={concerts}
            reservationsByConcertId={reservationsByConcertId}
            actionConcertId={actionConcertId}
            onReserve={handleReserve}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
