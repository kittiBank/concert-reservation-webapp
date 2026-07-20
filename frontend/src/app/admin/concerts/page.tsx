"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreateConcertForm } from "@/components/concerts/CreateConcertForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api/client";
import { deleteConcert, listConcerts } from "@/lib/api/concerts";
import type { Concert } from "@/types";

function AdminConcertsContent() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchConcerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listConcerts({ pageSize: 50 });
      setConcerts(response.data);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load concerts";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConcerts();
  }, [fetchConcerts]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      await deleteConcert(id);
      setConcerts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Concert deleted");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete concert";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageContainer
      title="Manage Concerts"
      description="Create and delete concerts"
      action={
        <Button onClick={() => setShowCreate(true)}>+ Create Concert</Button>
      }
    >
      {loading ? (
        <Spinner />
      ) : concerts.length === 0 ? (
        <EmptyState
          title="No concerts yet"
          description="Create your first concert to get started."
          action={
            <Button onClick={() => setShowCreate(true)}>Create Concert</Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="px-4 py-3 font-medium text-surface-700">Name</th>
                <th className="px-4 py-3 font-medium text-surface-700">Seats</th>
                <th className="px-4 py-3 font-medium text-surface-700">Booked</th>
                <th className="px-4 py-3 font-medium text-surface-700">Status</th>
                <th className="px-4 py-3 font-medium text-surface-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {concerts.map((concert) => (
                <tr
                  key={concert.id}
                  className="border-b border-surface-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-surface-900">{concert.name}</p>
                    <p className="line-clamp-1 text-xs text-surface-500">
                      {concert.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-surface-700">
                    {concert.totalSeats}
                  </td>
                  <td className="px-4 py-3 text-surface-700">
                    {concert.reservedCount}
                  </td>
                  <td className="px-4 py-3">
                    {concert.isSoldOut ? (
                      <Badge variant="danger">Sold Out</Badge>
                    ) : (
                      <Badge variant="success">Available</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deletingId === concert.id}
                      onClick={() => handleDelete(concert.id, concert.name)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateConcertForm
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={fetchConcerts}
      />
    </PageContainer>
  );
}

export default function AdminConcertsPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminConcertsContent />
    </AuthGuard>
  );
}
