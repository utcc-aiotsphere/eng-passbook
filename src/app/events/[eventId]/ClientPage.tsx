"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpenCheck } from "lucide-react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { StationCard } from "@/components/station/StationCard";
import { useAuth } from "@/hooks/useAuth";
import { getEvent } from "@/services/eventService";
import { joinEvent } from "@/services/checkinService";
import { listStations } from "@/services/stationService";
import type { EventDoc } from "@/types/event";
import type { Station } from "@/types/station";

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    getEvent(eventId).then(setEvent);
    listStations(eventId).then(setStations).catch(() => setStations([]));
  }, [eventId]);
  async function join() {
    if (!event || !user) {
      setMessage("กรุณาเข้าสู่ระบบก่อนเข้าร่วมกิจกรรม");
      return;
    }
    await joinEvent(event, user);
    router.push(`/app/passbook/${eventId}`);
  }
  if (!event) return <main className="p-8">กำลังโหลดกิจกรรม...</main>;
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 md:px-8">
      <PageHeader title={event.name} description={event.description} action={<NeonButton onClick={join}><BookOpenCheck size={16} /> เข้าร่วมและเปิด Passbook</NeonButton>} />
      {message ? <CyberCard className="mb-5 p-4 text-amber-100">{message}</CyberCard> : null}
      <div className="grid gap-4 md:grid-cols-2">{stations.map((station) => <StationCard key={station.stationId} station={station} />)}</div>
    </main>
  );
}

