import { CheckCircle2, MapPin, Timer } from "lucide-react";
import type { Station } from "@/types/station";
import { CyberCard } from "@/components/cyber/CyberCard";

export function StationCard({ station, completed = false }: { station: Station; completed?: boolean }) {
  return (
    <CyberCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm font-semibold text-cyan-200">Station {station.stationNumber.toString().padStart(2, "0")}</div>
          <h3 className="text-lg font-bold">{station.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{station.description}</p>
        </div>
        {completed ? <CheckCircle2 className="text-emerald-300" /> : <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_16px_#38D6FF]" />}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
        <span className="inline-flex items-center gap-1"><MapPin size={14} /> {station.locationLabel || "UTCC"}</span>
        <span className="inline-flex items-center gap-1"><Timer size={14} /> {station.estimatedDurationMinutes} นาที</span>
        <span className={station.isRequired ? "text-amber-200" : "text-slate-400"}>{station.isRequired ? "ฐานบังคับ" : "ฐานเสริม"}</span>
      </div>
    </CyberCard>
  );
}

