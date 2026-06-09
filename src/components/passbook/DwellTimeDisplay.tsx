import { Clock3 } from "lucide-react";
import { formatDuration } from "@/utils/time";

export function DwellTimeDisplay({ seconds }: { seconds: number }) {
  return <span className="inline-flex items-center gap-2 text-cyan-100"><Clock3 size={16} /> {formatDuration(seconds)}</span>;
}

