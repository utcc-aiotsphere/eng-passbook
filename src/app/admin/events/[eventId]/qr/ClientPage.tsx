"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/cyber/PageHeader";
import { QRCodeCard } from "@/components/station/QRCodeCard";
import { QRPoster } from "@/components/station/QRPoster";
import { getEvent } from "@/services/eventService";
import { listStations } from "@/services/stationService";
import type { EventDoc } from "@/types/event";
import type { Station } from "@/types/station";

export default function QrAdminPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  useEffect(() => { getEvent(eventId).then(setEvent); listStations(eventId).then(setStations).catch(() => []); }, [eventId]);
  return (
    <AdminLayout>
      <PageHeader title="สร้าง QR Code ประจำฐาน" description="ดาวน์โหลด QR และ poster สำหรับพิมพ์ติดที่ฐานกิจกรรม" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{stations.map((station) => <QRCodeCard key={station.stationId} title={station.name} value={station.qrUrl || ""} />)}</div>
      {event ? <div className="mt-8 grid gap-5 md:grid-cols-2">{stations.map((station) => <QRPoster key={station.stationId} event={event} station={station} />)}</div> : null}
    </AdminLayout>
  );
}

