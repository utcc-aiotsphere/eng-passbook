import { Cpu } from "lucide-react";

export function PassbookProgress({ completed, total, percent }: { completed: number; total: number; percent: number }) {
  return (
    <div className="rounded-lg border border-cyan-300/20 bg-slate-950/55 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold"><Cpu className="text-cyan-300" /> ความคืบหน้า Passbook</div>
        <span className="text-cyan-200">{completed}/{total}</span>
      </div>
      <div className="h-4 rounded-full bg-slate-800">
        <div className="h-4 rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 shadow-[0_0_18px_rgba(56,214,255,.35)]" style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-300">{percent >= 100 ? "ปลดล็อกสิทธิ์ Badge และรางวัลแล้ว" : `เหลืออีก ${Math.max(0, total - completed)} ฐานเพื่อรับ Badge`}</p>
    </div>
  );
}

