"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDocs } from "firebase/firestore";
import { Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/cyber/PageHeader";
import { NeonButton } from "@/components/cyber/NeonButton";
import { refs } from "@/lib/firebase/firestore";
import { toCsv, downloadTextFile } from "@/utils/csv";
import type { Participant } from "@/types/event";

export default function ParticipantsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  useEffect(() => { getDocs(refs.participants(eventId)).then((snap) => setParticipants(snap.docs.map((doc) => doc.data() as Participant))); }, [eventId]);
  return (
    <AdminLayout>
      <PageHeader title="Participants" description="รายชื่อผู้เข้าร่วม ความคืบหน้า Badge และ Reward" action={<NeonButton onClick={() => downloadTextFile("participants.csv", toCsv(participants as unknown as Record<string, unknown>[]))}><Download size={16} /> Export CSV</NeonButton>} />
      <div className="overflow-hidden rounded-lg border border-cyan-300/20"><table className="w-full text-left text-sm"><thead className="bg-cyan-300/10"><tr><th className="p-3">Name</th><th className="p-3">Progress</th><th className="p-3">Reward</th></tr></thead><tbody>{participants.map((p) => <tr key={p.userId} className="border-t border-cyan-300/10"><td className="p-3">{p.displayName}</td><td className="p-3">{p.progressPercent}%</td><td className="p-3">{p.rewardStatus}</td></tr>)}</tbody></table></div>
    </AdminLayout>
  );
}

