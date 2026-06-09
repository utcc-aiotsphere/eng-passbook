"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { StationForm } from "@/components/admin/StationForm";
import { StationCard } from "@/components/station/StationCard";
import { useAuth } from "@/hooks/useAuth";
import { createStation, listStations } from "@/services/stationService";
import type { Station } from "@/types/station";

export default function StationsAdminPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const [stations, setStations] = useState<Station[]>([]);
  const refresh = useCallback(async () => { setStations(await listStations(eventId).catch(() => [])); }, [eventId]);
  useEffect(() => { refresh(); }, [refresh]);
  return (
    <AdminLayout>
      <PageHeader title="จัดการฐานกิจกรรม" description="เพิ่ม แก้ไข เปิด/ปิด และกำหนดฐานบังคับ" />
      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <CyberCard className="p-5"><StationForm onSubmit={async (values) => { if (!user) return; await createStation(eventId, values, user); await refresh(); }} /></CyberCard>
        <div className="grid gap-4">{stations.map((station) => <StationCard key={station.stationId} station={station} />)}</div>
      </div>
    </AdminLayout>
  );
}
