"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDocs } from "firebase/firestore";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/cyber/PageHeader";
import { NeonButton } from "@/components/cyber/NeonButton";
import { refs } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { updateRewardEligibility } from "@/services/rewardService";
import type { Participant } from "@/types/event";

export default function RewardsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const refresh = useCallback(async () => { const snap = await getDocs(refs.participants(eventId)); setParticipants(snap.docs.map((doc) => doc.data() as Participant)); }, [eventId]);
  useEffect(() => { refresh(); }, [refresh]);
  return (
    <AdminLayout>
      <PageHeader title="Reward Claims" description="ตรวจสิทธิ์และ mark claimed สำหรับผู้ที่ผ่านครบตามเงื่อนไข" />
      <div className="grid gap-3">{participants.filter((p) => p.rewardStatus !== "notEligible").map((p) => <div key={p.userId} className="flex flex-col justify-between gap-3 rounded-lg border border-cyan-300/20 bg-slate-950/55 p-4 md:flex-row md:items-center"><div><p className="font-bold">{p.displayName}</p><p className="text-sm text-slate-300">{p.rewardStatus}</p></div><NeonButton onClick={async () => { if (!user) return; await updateRewardEligibility(eventId, p.userId, "claimed", user); await refresh(); }}>Mark claimed</NeonButton></div>)}</div>
    </AdminLayout>
  );
}
