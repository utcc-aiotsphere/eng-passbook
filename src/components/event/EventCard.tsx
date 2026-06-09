import { CalendarDays, MapPin, RadioTower } from "lucide-react";
import type { EventDoc } from "@/types/event";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";

export function EventCard({ event, admin = false }: { event: EventDoc; admin?: boolean }) {
  return (
    <CyberCard className="flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <RadioTower className="text-cyan-300" />
          <span className="rounded-md bg-emerald-400/12 px-2 py-1 text-xs font-semibold text-emerald-200">{event.status}</span>
        </div>
        <h2 className="text-xl font-bold text-white">{event.name}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">{event.description || "กิจกรรม UTCC Engineering สำหรับสะสมฐานและปลดล็อก Badge"}</p>
        <div className="mt-4 space-y-2 text-sm text-slate-300">
          <div className="flex items-center gap-2"><MapPin size={16} className="text-cyan-300" /> {event.location || "UTCC Engineering"}</div>
          <div className="flex items-center gap-2"><CalendarDays size={16} className="text-cyan-300" /> {event.visibility}</div>
        </div>
      </div>
      <NeonButton href={admin ? `/admin/events/${event.eventId}` : `/events/${event.eventId}`} className="mt-5 w-full">
        {admin ? "เปิดแดชบอร์ด" : "เข้าร่วมกิจกรรม"}
      </NeonButton>
    </CyberCard>
  );
}
