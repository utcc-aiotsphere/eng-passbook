"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { BadgePreview } from "@/components/badge/BadgePreview";
import { BadgeCanvasExporter } from "@/components/badge/BadgeCanvasExporter";
import { getEvent } from "@/services/eventService";
import { renderBadgeSvg } from "@/utils/badgeRenderer";
import type { EventDoc } from "@/types/event";

export default function BadgeAdminPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventDoc | null>(null);
  useEffect(() => { getEvent(eventId).then(setEvent); }, [eventId]);
  const config = event?.badgeTemplate || { badgeTitle: "AIoT Sphere Explorer", badgeLevel: "Explorer" as const, badgeIcon: "AI", colorTheme: "cyan" as const };
  const svg = renderBadgeSvg({ config, participantName: "Demo Participant", eventName: event?.name || "UTCC AIoT Sphere", issuedText: "COMPLETED", verificationCode: "DEMO-VERIFY" });
  return (
    <AdminLayout>
      <PageHeader title="Badge Designer" description="ตัวอย่าง Badge client-side SVG/Canvas สำหรับกิจกรรมนี้" />
      <CyberCard className="p-5"><BadgePreview config={config} eventName={event?.name} /><div className="mt-5"><BadgeCanvasExporter svg={svg} /></div></CyberCard>
    </AdminLayout>
  );
}

