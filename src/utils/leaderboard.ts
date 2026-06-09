import type { Participant } from "@/types/event";

export type LeaderboardRow = {
  rank: number;
  userId: string;
  displayName: string;
  totalValidDwellSeconds: number;
  completedAt?: unknown;
};

export function sortLeaderboard(participants: Participant[]): LeaderboardRow[] {
  return [...participants]
    .sort((a, b) => {
      if (b.totalValidDwellSeconds !== a.totalValidDwellSeconds) {
        return b.totalValidDwellSeconds - a.totalValidDwellSeconds;
      }
      return a.displayName.localeCompare(b.displayName);
    })
    .map((participant, index) => ({
      rank: index + 1,
      userId: participant.userId,
      displayName: participant.displayName,
      totalValidDwellSeconds: participant.totalValidDwellSeconds,
      completedAt: participant.completedAt,
    }));
}

