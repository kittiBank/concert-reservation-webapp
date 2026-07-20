import { formatAuditDateTime } from "@/lib/format/date";
import type { Reservation } from "@/types";

const columns = [
  { key: "datetime", label: "Date time" },
  { key: "username", label: "Username" },
  { key: "concert", label: "Concert name" },
  { key: "action", label: "Action" },
] as const;

interface AdminHistoryTableProps {
  reservations: Reservation[];
}

export function AdminHistoryTable({ reservations }: AdminHistoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="h-[50px]">
            {columns.map(({ key, label }) => (
              <th
                key={key}
                className="h-[50px] border border-[#E5E7EB] px-4 text-left text-[20px] font-semibold text-[#111827]"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="h-[44px]">
              <td className="h-[44px] border border-[#E5E7EB] px-4 text-left text-[16px] text-[#111827]">
                {formatAuditDateTime(reservation.createdAt)}
              </td>
              <td className="h-[44px] border border-[#E5E7EB] px-4 text-left text-[16px] text-[#111827]">
                {reservation.user?.email ?? `User #${reservation.userId}`}
              </td>
              <td className="h-[44px] border border-[#E5E7EB] px-4 text-left text-[16px] text-[#111827]">
                {reservation.concert.name}
              </td>
              <td className="h-[44px] border border-[#E5E7EB] px-4 text-left text-[16px] text-[#111827]">
                Reserve
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
