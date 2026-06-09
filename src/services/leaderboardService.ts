import { getDocs, limit, query, where } from "firebase/firestore";
import { refs } from "@/lib/firebase/firestore";
import type { Participant } from "@/types/event";
import { sortLeaderboard } from "@/utils/leaderboard";

export async function getEventLeaderboard(eventId: string, count = 10) {
  const snap = await getDocs(query(refs.participants(eventId), limit(100)));
  return sortLeaderboard(snap.docs.map((item) => item.data() as Participant)).slice(0, count);
}

export async function getCompletionLeaderboard(eventId: string, count = 10) {
  const snap = await getDocs(query(refs.participants(eventId), where("progressPercent", ">=", 100), limit(100)));
  return sortLeaderboard(snap.docs.map((item) => item.data() as Participant)).slice(0, count);
}

export async function getStationLeaderboard(eventId: string, stationId: string, count = 10) {
  const snap = await getDocs(query(refs.checkins(eventId), where("stationId", "==", stationId), limit(200)));
  const totals = new Map<string, { displayName: string; seconds: number }>();
  snap.docs.forEach((item) => {
    const data = item.data();
    const current = totals.get(data.userId) || { displayName: data.userId, seconds: 0 };
    totals.set(data.userId, { ...current, seconds: current.seconds + (data.validDurationSeconds || 0) });
  });
  return [...totals.entries()]
    .map(([userId, value]) => ({ rank: 0, userId, displayName: value.displayName, totalValidDwellSeconds: value.seconds }))
    .sort((a, b) => b.totalValidDwellSeconds - a.totalValidDwellSeconds)
    .slice(0, count)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

