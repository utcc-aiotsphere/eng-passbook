import { Gift } from "lucide-react";
import type { RewardStatus } from "@/types/reward";

const copy: Record<RewardStatus, string> = {
  notEligible: "ยังไม่เข้าเงื่อนไขรับของรางวัล",
  eligible: "มีสิทธิ์รับของรางวัล",
  claimed: "รับของรางวัลแล้ว",
  rejected: "ไม่ผ่านการตรวจสอบสิทธิ์",
};

export function RewardStatusBanner({ status }: { status: RewardStatus }) {
  const active = status === "eligible" || status === "claimed";
  return (
    <div className={`rounded-lg border p-4 ${active ? "border-emerald-300/35 bg-emerald-400/10 text-emerald-100" : "border-amber-300/30 bg-amber-300/10 text-amber-100"}`}>
      <div className="flex items-center gap-2 font-bold"><Gift size={18} /> {copy[status]}</div>
      {status === "eligible" ? <p className="mt-2 text-sm">แสดง QR นี้ให้เจ้าหน้าที่ตรวจเพื่อรับของรางวัล</p> : null}
    </div>
  );
}

