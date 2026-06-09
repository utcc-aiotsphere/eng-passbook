"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/cyber/PageHeader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { getEventLeaderboard } from "@/services/leaderboardService";
import type { LeaderboardRow } from "@/utils/leaderboard";

export default function UserLeaderboardPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  useEffect(() => { getEventLeaderboard(eventId).then(setRows); }, [eventId]);
  return <ProtectedRoute><main className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:px-8"><PageHeader title="Leaderboard" description="อันดับผู้เข้าร่วมตามเวลาที่อยู่ในฐาน" /><LeaderboardTable rows={rows} /></main></ProtectedRoute>;
}

