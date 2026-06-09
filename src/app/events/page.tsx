"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { EventCard } from "@/components/event/EventCard";
import { EmptyState } from "@/components/cyber/EmptyState";
import { LoadingState } from "@/components/cyber/LoadingState";
import { listPublicEvents } from "@/services/eventService";
import type { EventDoc } from "@/types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listPublicEvents().then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:px-8">
      <PageHeader title="กิจกรรมที่เปิดให้เข้าร่วม" description="เลือกกิจกรรม UTCC Engineering เพื่อเริ่มสะสมฐานใน Passbook" />
      {loading ? <LoadingState /> : events.length === 0 ? <EmptyState title="ยังไม่มีกิจกรรมสาธารณะ" description="เพิ่ม seed demo หรือสร้างกิจกรรมจากหน้า Admin" /> : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{events.map((event) => <EventCard key={event.eventId} event={event} />)}</div>
      )}
    </main>
  );
}

