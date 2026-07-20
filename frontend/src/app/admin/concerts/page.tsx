"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCreateConcertForm } from "@/components/admin/AdminCreateConcertForm";
import { AdminConcertOverviewList } from "@/components/admin/AdminConcertOverviewList";
import { AdminDeleteConcertModal } from "@/components/admin/AdminDeleteConcertModal";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { Button } from "@/components/ui/Button";
import { CheckCircleIcon } from "@/components/ui/CheckCircleIcon";
import { EmptyState, Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/client";
import {
  deleteConcert,
  getConcertStats,
  listConcerts,
} from "@/lib/api/concerts";
import type { Concert, ConcertStats } from "@/types";

type AdminTab = "overview" | "create";

export default function AdminConcertsPage() {
  const [tab, setTab] = useState<AdminTab>("create");
  const [stats, setStats] = useState<ConcertStats | null>(null);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, concertsData] = await Promise.all([
        getConcertStats(),
        listConcerts({ pageSize: 50 }),
      ]);
      setStats(statsData);
      setConcerts(concertsData.data);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteRequest = (id: number, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    try {
      await deleteConcert(deleteTarget.id);
      toast.success("Delete successfully", {
        icon: <CheckCircleIcon />,
      });
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete concert";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "create", label: "Create" },
  ];

  return (
    <div className="flex flex-col p-3 sm:p-4 md:h-full md:min-h-0 md:overflow-hidden md:p-6">
      {loading && !stats ? (
        <Spinner />
      ) : (
        <>
          {stats && <AdminStatCards stats={stats} />}

          <div className="mt-3 shrink-0 border-b border-[#E5E7EB] sm:mt-4 md:mt-5">
            <nav className="flex gap-6 sm:gap-8">
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "relative pb-3 text-sm font-medium transition-colors",
                    tab === id
                      ? "text-[#1692EC]"
                      : "text-[#9CA3AF] hover:text-[#6B7280]",
                  )}
                >
                  {label}
                  {tab === id && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#1692EC]" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-3 sm:mt-4 md:mt-5 md:min-h-0 md:flex-1 md:overflow-hidden">
            {tab === "create" ? (
              <AdminCreateConcertForm onSuccess={fetchData} />
            ) : loading ? (
              <Spinner />
            ) : concerts.length === 0 ? (
              <EmptyState
                title="No concerts yet"
                description="Switch to Create tab to add your first concert."
                action={
                  <Button onClick={() => setTab("create")}>Create Concert</Button>
                }
              />
            ) : (
              <AdminConcertOverviewList
                concerts={concerts}
                deletingId={deletingId}
                onDelete={handleDeleteRequest}
              />
            )}
          </div>

          <AdminDeleteConcertModal
            open={deleteTarget !== null}
            concertName={deleteTarget?.name ?? ""}
            loading={deletingId !== null}
            onCancel={() => {
              if (deletingId === null) setDeleteTarget(null);
            }}
            onConfirm={handleDeleteConfirm}
          />
        </>
      )}
    </div>
  );
}
