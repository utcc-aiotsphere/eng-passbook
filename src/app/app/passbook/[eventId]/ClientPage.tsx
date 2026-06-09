"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LogOut } from "lucide-react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { StationCard } from "@/components/station/StationCard";
import { PassbookProgress } from "@/components/passbook/PassbookProgress";
import { RewardStatusBanner } from "@/components/reward/RewardStatusBanner";
import { useAuth } from "@/hooks/useAuth";
import { getEvent } from "@/services/eventService";
import { closeActiveStationSession, getParticipant, joinEvent } from "@/services/checkinService";
import { listStations } from "@/services/stationService";
import type { EventDoc, Participant } from "@/types/event";
import type { Station } from "@/types/station";

export default function PassbookPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [stations, setStations] = useState<Station[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    const loadedEvent = await getEvent(eventId);
    setEvent(loadedEvent);
    setStations(await listStations(eventId).catch(() => []));
    if (loadedEvent) await joinEvent(loadedEvent, user);
    setParticipant(await getParticipant(eventId, user.uid));
  }, [eventId, user]);

  useEffect(() => { refresh(); }, [refresh]);

  async function leaveStation() {
    if (!user || !event) return;
    await closeActiveStationSession(eventId, user.uid, event.maxDwellMinutesPerStation);
    await refresh();
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 md:px-8">
        <PageHeader title={event?.name || "Passbook"} description="ดูความคืบหน้าฐานกิจกรรม สถานะ Badge และสิทธิ์รับรางวัล" />
        {participant ? (
          <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <div className="space-y-5">
              <PassbookProgress completed={participant.requiredCompletedCount} total={participant.totalRequiredCount} percent={participant.progressPercent} />
              <RewardStatusBanner status={participant.rewardStatus} />
              {participant.activeSessionId ? <CyberCard className="p-5"><p className="font-bold">กำลังอยู่ที่ฐาน {participant.lastActiveStationId}</p><NeonButton onClick={leaveStation} className="mt-4"><LogOut size={16} /> Leave Station</NeonButton></CyberCard> : null}
            </div>
            <div className="grid gap-4">{stations.map((station) => <StationCard key={station.stationId} station={station} completed={participant.completedStationIds.includes(station.stationId)} />)}</div>
          </div>
        ) : <CyberCard className="p-5">กำลังเตรียม Passbook...</CyberCard>}
      </main>
    </ProtectedRoute>
  );
}
