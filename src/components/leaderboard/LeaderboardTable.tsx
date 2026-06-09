import { Trophy } from "lucide-react";
import type { LeaderboardRow } from "@/utils/leaderboard";
import { formatDuration } from "@/utils/time";

export function LeaderboardTable({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-cyan-300/20">
      <table className="w-full text-left text-sm">
        <thead className="bg-cyan-300/10 text-cyan-100">
          <tr><th className="p-3">Rank</th><th className="p-3">ผู้เข้าร่วม</th><th className="p-3">เวลาสะสม</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.userId} className="border-t border-cyan-300/10">
              <td className="p-3 font-bold text-amber-200"><Trophy className="mr-2 inline" size={16} />#{row.rank}</td>
              <td className="p-3">{row.displayName}</td>
              <td className="p-3 text-cyan-100">{formatDuration(row.totalValidDwellSeconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

