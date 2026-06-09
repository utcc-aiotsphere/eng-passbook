"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { stationSchema } from "@/schemas/stationSchema";
import { NeonButton } from "@/components/cyber/NeonButton";
import type { Station } from "@/types/station";
import type { z } from "zod";

type Values = z.input<typeof stationSchema>;

export function StationForm({ onSubmit }: { onSubmit: (values: Partial<Station>) => Promise<void> }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Values>({
    resolver: zodResolver(stationSchema),
    defaultValues: { name: "", description: "", locationLabel: "", stationNumber: 1, isRequired: true, isActive: true, estimatedDurationMinutes: 10 },
  });
  return (
    <form className="grid gap-3" onSubmit={handleSubmit(async (rawValues) => { await onSubmit(stationSchema.parse(rawValues)); reset(); })}>
      <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" placeholder="ชื่อฐาน" {...register("name")} />
      <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" placeholder="ตำแหน่งฐาน" {...register("locationLabel")} />
      <textarea className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" placeholder="รายละเอียด" {...register("description")} />
      <div className="grid gap-3 md:grid-cols-3">
        <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" type="number" {...register("stationNumber")} />
        <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" type="number" {...register("estimatedDurationMinutes")} />
        <label className="flex items-center gap-2 rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3"><input type="checkbox" {...register("isRequired")} /> required</label>
      </div>
      <NeonButton type="submit" disabled={isSubmitting}><Plus size={16} /> เพิ่มฐาน</NeonButton>
    </form>
  );
}
