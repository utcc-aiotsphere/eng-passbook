import { Orbit } from "lucide-react";
import { CyberCard } from "./CyberCard";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <CyberCard className="p-8 text-center">
      <Orbit className="mx-auto mb-4 text-cyan-300" size={42} />
      <h2 className="text-xl font-bold">{title}</h2>
      {description ? <p className="mx-auto mt-2 max-w-xl text-slate-300">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </CyberCard>
  );
}

