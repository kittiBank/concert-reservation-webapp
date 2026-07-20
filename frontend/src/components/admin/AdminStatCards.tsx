import { PublicIcon } from "@/components/ui/PublicIcon";
import type { ConcertStats } from "@/types";

function CancelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
    </svg>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div
      className="flex h-[160px] w-full flex-col items-center justify-center rounded-xl px-4 py-4 text-center text-white shadow-sm sm:h-[200px] md:h-full md:px-6 md:py-6"
      style={{ backgroundColor: color }}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center opacity-95 md:h-10 md:w-10">
        {icon}
      </div>

      <p className="mt-2 text-base font-medium leading-tight opacity-95 md:mt-4 md:text-[24px]">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold leading-none tracking-tight md:mt-4 md:text-[48px]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

interface AdminStatCardsProps {
  stats: ConcertStats;
}

export function AdminStatCards({ stats }: AdminStatCardsProps) {
  return (
    <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 md:h-[234px]">
      <StatCard
        label="Total of seats"
        value={stats.totalSeats}
        color="#0070A4"
        icon={
          <>
            <PublicIcon
              src="/icon/user-white.png"
              alt=""
              size={32}
              className="md:hidden"
            />
            <PublicIcon
              src="/icon/user-white.png"
              alt=""
              size={40}
              className="hidden md:block"
            />
          </>
        }
      />
      <StatCard
        label="Reserve"
        value={stats.reserved}
        color="#00A58B"
        icon={
          <>
            <PublicIcon src="/icon/award.png" alt="" size={32} className="md:hidden" />
            <PublicIcon src="/icon/award.png" alt="" size={40} className="hidden md:block" />
          </>
        }
      />
      <StatCard
        label="Cancel"
        value={stats.cancelled}
        color="#F96464"
        icon={
          <>
            <CancelIcon className="h-8 w-8 md:hidden" />
            <CancelIcon className="hidden h-10 w-10 md:block" />
          </>
        }
      />
    </div>
  );
}
