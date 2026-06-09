import { cn } from "@/utils/cn";

export function GlassPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-lg border border-cyan-300/20 bg-slate-950/45 shadow-[0_0_28px_rgba(56,214,255,0.08)] backdrop-blur", className)}>{children}</div>;
}

