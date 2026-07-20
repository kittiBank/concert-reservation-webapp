"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserConcertOverviewList } from "@/components/concerts/UserConcertOverviewList";
import { CheckCircleIcon } from "@/components/ui/CheckCircleIcon";
import { EmptyState, Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { dedupeRequest } from "@/lib/api/dedupe";
import { ApiError } from "@/lib/api/client";
import { listConcerts } from "@/lib/api/concerts";
import {
  cancelReservation,
  createReservation,
  listMyReservations,
} from "@/lib/api/reservations";
import type { Concert, Reservation } from "@/types";

async function loadUserHomeData(isAdminUser: boolean) {
  const concertsResponse = await listConcerts({ pageSize: 50 });

  let reservations: Reservation[] = [];
  if (!isAdminUser) {
    const reservationsResponse = await listMyReservations({ pageSize: 100 });
    reservations = reservationsResponse.data;
  }

  return { concertsResponse, reservations };
}

function buildReservationsMap(
  reservations: Reservation[],
): Record<number, number> {
  return Object.fromEntries(
    reservations.map((reservation) => [reservation.concertId, reservation.id]),
  );
}

export default function ConcertsPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservationsByConcertId, setReservationsByConcertId] = useState<
    Record<number, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [actionConcertId, setActionConcertId] = useState<number | null>(null);

  const refreshData = useCallback(async () => {
    const { concertsResponse, reservations } = await loadUserHomeData(isAdmin);
    setConcerts(concertsResponse.data);
    setReservationsByConcertId(buildReservationsMap(reservations));
  }, [isAdmin]);

  useEffect(() => {
    if (authLoading || !user) return;

    const currentUser = user;
    let cancelled = false;

    async function fetchData() {
      setLoading(true);

      try {
        const { concertsResponse, reservations } = await dedupeRequest(
          `user-concerts-home-${currentUser.id}-${currentUser.role}`,
          () => loadUserHomeData(isAdmin),
        );

        if (cancelled) return;

        setConcerts(concertsResponse.data);
        setReservationsByConcertId(buildReservationsMap(reservations));
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
  }, [authLoading, user, isAdmin]);

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
      {authLoading || loading ? (
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
