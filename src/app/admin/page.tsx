"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { useAuth } from "@/hooks/useAuth";
import { listAccessibleEvents } from "@/services/eventService";
import type { EventDoc } from "@/types/event";

export default function AdminPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventDoc[]>([]);
  useEffect(() => { listAccessibleEvents(user).then(setEvents).catch(() => setEvents([])); }, [user]);
  const metrics = [
    ["กิจกรรม", events.length],
    ["Active", events.filter((event) => event.status === "active").length],
    ["Published", events.filter((event) => event.status === "published").length],
    ["Archived", events.filter((event) => event.status === "archived").length],
  ];
  return (
    <AdminLayout>
      <PageHeader title="Admin Dashboard" description="ภาพรวมกิจกรรม Check-in, Badge, Reward และการจัดการ UTCC ENG Passbook" />
      <div className="mb-5 grid gap-4 md:grid-cols-4">{metrics.map(([label, value]) => <CyberCard key={label} className="p-5"><p className="text-sm text-slate-300">{label}</p><p className="mt-2 text-3xl font-black text-cyan-100">{value}</p></CyberCard>)}</div>
      <DashboardCharts stationData={[{ name: "AIBI", visits: 24, dwell: 400 }, { name: "AIX", visits: 18, dwell: 320 }]} trendData={[{ time: "09:00", checkins: 4 }, { time: "10:00", checkins: 14 }, { time: "11:00", checkins: 28 }]} />
    </AdminLayout>
  );
}

