import { Sparkles } from "lucide-react";

export function PageHeader({ eyebrow = "UTCC ENG Passbook", title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          <Sparkles size={14} /> {eyebrow}
        </div>
        <h1 className="neon-text text-3xl font-black tracking-normal md:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

