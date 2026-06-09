"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Gift, QrCode, RadioTower, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { getEvent } from "@/services/eventService";
import { listStations } from "@/services/stationService";
import type { EventDoc } from "@/types/event";
import type { Station } from "@/types/station";

export default function EventAdminDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  useEffect(() => { getEvent(eventId).then(setEvent); listStations(eventId).then(setStations).catch(() => []); }, [eventId]);
  const links = [
    ["Stations", `/admin/events/${eventId}/stations`, RadioTower],
    ["QR Codes", `/admin/events/${eventId}/qr`, QrCode],
    ["Badge", `/admin/events/${eventId}/badge`, Badge],
    ["Participants", `/admin/events/${eventId}/participants`, Users],
    ["Rewards", `/admin/events/${eventId}/rewards`, Gift],
  ];
  return (
    <AdminLayout>
      <PageHeader title={event?.name || "Event Dashboard"} description="แดชบอร์ดสำหรับบริหารกิจกรรมและดู analytics" />
      <div className="mb-5 grid gap-4 md:grid-cols-5">{links.map(([label, href, Icon]) => <Link key={label as string} href={href as string}><CyberCard className="p-5"><Icon className="mb-3 text-cyan-300" /><p className="font-bold">{label as string}</p></CyberCard></Link>)}</div>
      <DashboardCharts stationData={stations.map((station) => ({ name: station.name, visits: 0, dwell: station.estimatedDurationMinutes }))} trendData={[{ time: "now", checkins: 0 }]} />
    </AdminLayout>
  );
}

