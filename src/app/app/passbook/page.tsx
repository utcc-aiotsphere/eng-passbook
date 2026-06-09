"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { EventCard } from "@/components/event/EventCard";
import { EmptyState } from "@/components/cyber/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { listPublicEvents } from "@/services/eventService";
import type { EventDoc } from "@/types/event";

export default function PassbookListPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventDoc[]>([]);
  useEffect(() => { listPublicEvents().then(setEvents).catch(() => setEvents([])); }, [user]);
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:px-8">
        <PageHeader title="สมุดสะสมฐานกิจกรรม" description="เลือกกิจกรรมเพื่อดูความคืบหน้าและสถานะรางวัล" />
        {events.length === 0 ? <EmptyState title="ยังไม่มีกิจกรรม" /> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{events.map((event) => <EventCard key={event.eventId} event={event} />)}</div>}
      </main>
    </ProtectedRoute>
  );
}

