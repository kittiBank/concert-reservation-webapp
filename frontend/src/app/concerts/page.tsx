"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ConcertCard } from "@/components/concerts/ConcertCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState, Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { listConcerts } from "@/lib/api/concerts";
import { ApiError } from "@/lib/api/client";
import type { Concert } from "@/types";

function ConcertsContent() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchConcerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listConcerts({ page, pageSize: 12 });
      setConcerts(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load concerts";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchConcerts();
  }, [fetchConcerts]);

  return (
    <PageContainer
      title="All Concerts"
      description="Browse upcoming concerts and reserve your seat"
    >
      {loading ? (
        <Spinner />
      ) : concerts.length === 0 ? (
        <EmptyState
          title="No concerts yet"
          description="Check back later for upcoming events."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {concerts.map((concert) => (
              <ConcertCard key={concert.id} concert={concert} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-surface-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}

export default function ConcertsPage() {
  return (
    <AuthGuard>
      <ConcertsContent />
    </AuthGuard>
  );
}
