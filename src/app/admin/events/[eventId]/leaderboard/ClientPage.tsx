"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/cyber/PageHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { getEventLeaderboard } from "@/services/leaderboardService";
import type { LeaderboardRow } from "@/utils/leaderboard";

export default function AdminLeaderboardPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  useEffect(() => { getEventLeaderboard(eventId, 100).then(setRows); }, [eventId]);
  return <AdminLayout><PageHeader title="Full Leaderboard" description="อันดับผู้เข้าร่วมทั้งหมดสำหรับ Event Manager/Admin" /><LeaderboardTable rows={rows} /></AdminLayout>;
}

