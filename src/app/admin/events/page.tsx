"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { NeonButton } from "@/components/cyber/NeonButton";
import { EventCard } from "@/components/event/EventCard";
import { useAuth } from "@/hooks/useAuth";
import { listAccessibleEvents } from "@/services/eventService";
import type { EventDoc } from "@/types/event";

export default function AdminEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventDoc[]>([]);
  useEffect(() => { listAccessibleEvents(user).then(setEvents).catch(() => setEvents([])); }, [user]);
  return (
    <AdminLayout>
      <PageHeader title="จัดการกิจกรรม" description="สร้าง แก้ไข เผยแพร่ และติดตาม Event ที่คุณมีสิทธิ์ดูแล" action={<NeonButton href="/admin/events/new"><Plus size={16} /> สร้างกิจกรรม</NeonButton>} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{events.map((event) => <EventCard key={event.eventId} event={event} admin />)}</div>
    </AdminLayout>
  );
}

