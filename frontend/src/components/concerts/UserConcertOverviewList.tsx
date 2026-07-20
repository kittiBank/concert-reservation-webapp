"use client";

import { PublicIcon } from "@/components/ui/PublicIcon";
import type { Concert } from "@/types";

interface UserConcertOverviewListProps {
  concerts: Concert[];
  reservationsByConcertId: Record<number, number>;
  actionConcertId: number | null;
  onReserve: (concertId: number) => void;
  onCancel: (concertId: number, reservationId: number) => void;
}

export function UserConcertOverviewList({
  concerts,
  reservationsByConcertId,
  actionConcertId,
  onReserve,
  onCancel,
}: UserConcertOverviewListProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:h-full md:overflow-auto">
      {concerts.map((concert) => {
        const reservationId = reservationsByConcertId[concert.id];
        const isReserved = reservationId !== undefined;
        const isLoading = actionConcertId === concert.id;

        return (
          <article
            key={concert.id}
            className="flex min-h-[160px] flex-col rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:min-h-[180px] sm:p-5"
          >
            <h3 className="text-base font-semibold text-[#1692EC] sm:text-lg">
              {concert.name}
            </h3>

            <hr className="my-3 border-[#E5E7EB] sm:my-4" />

            <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-[#6B7280]">
              {concert.description}
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full items-center gap-2 sm:w-[400px] sm:max-w-full sm:gap-3">
                <PublicIcon
                  src="/icon/user-white.png"
                  alt=""
                  size={28}
                  className="brightness-0 opacity-60 sm:hidden"
                />
                <PublicIcon
                  src="/icon/user-white.png"
                  alt=""
                  size={32}
                  className="hidden brightness-0 opacity-60 sm:block"
                />
                <span className="text-xl text-[#374151] sm:text-[24px]">
                  {concert.totalSeats.toLocaleString()}
                </span>
              </div>

              {isReserved ? (
                <button
                  type="button"
                  disabled={actionConcertId !== null}
                  onClick={() => onCancel(concert.id, reservationId)}
                  className="inline-flex h-9 w-full items-center justify-center rounded-md bg-[#F96464] px-4 text-sm font-medium text-white transition-colors hover:bg-[#e85555] disabled:opacity-60 sm:w-auto"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Cancel"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={concert.isSoldOut || actionConcertId !== null}
                  onClick={() => onReserve(concert.id)}
                  className="inline-flex h-9 w-full items-center justify-center rounded-md bg-[#1692EC] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0070A4] disabled:opacity-60 sm:w-auto"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : concert.isSoldOut ? (
                    "Sold out"
                  ) : (
                    "Reserve"
                  )}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
