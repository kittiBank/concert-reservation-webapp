import { PublicIcon } from "@/components/ui/PublicIcon";
import type { Concert } from "@/types";

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 12a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9l1-12" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" strokeLinecap="round" />
    </svg>
  );
}

interface AdminConcertOverviewListProps {
  concerts: Concert[];
  deletingId: number | null;
  onDelete: (id: number, name: string) => void;
}

export function AdminConcertOverviewList({
  concerts,
  deletingId,
  onDelete,
}: AdminConcertOverviewListProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:h-full md:overflow-auto">
      {concerts.map((concert) => (
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

            <button
              type="button"
              disabled={deletingId === concert.id}
              onClick={() => onDelete(concert.id, concert.name)}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#F96464] px-4 text-sm font-medium text-white transition-colors hover:bg-[#e85555] disabled:opacity-60 sm:w-auto"
            >
              {deletingId === concert.id ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <TrashIcon />
                  Delete
                </>
              )}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
