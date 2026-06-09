import { Loader2 } from "lucide-react";

export function LoadingState({ label = "กำลังโหลดข้อมูล..." }: { label?: string }) {
  return <div className="flex items-center gap-2 text-cyan-200"><Loader2 className="animate-spin" size={18} /> {label}</div>;
}

