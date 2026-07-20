import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Concert } from "@/types";

interface ConcertCardProps {
  concert: Concert;
}

export function ConcertCard({ concert }: ConcertCardProps) {
  return (
    <Link
      href={`/concerts/${concert.id}`}
      className="group flex flex-col rounded-xl border border-surface-200 bg-white p-5 shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-surface-900 group-hover:text-brand-700">
          {concert.name}
        </h3>
        {concert.isSoldOut ? (
          <Badge variant="danger">Sold Out</Badge>
        ) : (
          <Badge variant="success">{concert.availableSeats} left</Badge>
        )}
      </div>
      <p className="mb-4 line-clamp-2 flex-1 text-sm text-surface-600">
        {concert.description}
      </p>
      <div className="flex items-center justify-between text-xs text-surface-500">
        <span>
          {concert.reservedCount} / {concert.totalSeats} seats booked
        </span>
        <span className="font-medium text-brand-600 group-hover:underline">
          View details →
        </span>
      </div>
    </Link>
  );
}
