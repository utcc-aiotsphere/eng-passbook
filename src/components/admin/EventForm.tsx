"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { Save } from "lucide-react";
import { eventSchema } from "@/schemas/eventSchema";
import { NeonButton } from "@/components/cyber/NeonButton";
import type { EventDoc } from "@/types/event";
import type { z } from "zod";

type FormValues = z.input<typeof eventSchema>;

export function EventForm({ initial, onSubmit }: { initial?: Partial<EventDoc>; onSubmit: (values: Partial<EventDoc>) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: initial?.name || "",
      description: initial?.description || "",
      location: initial?.location || "",
      startAt: "",
      endAt: "",
      status: initial?.status || "draft",
      visibility: initial?.visibility || "public",
      maxDwellMinutesPerStation: initial?.maxDwellMinutesPerStation || 30,
    },
  });
  return (
    <form className="grid gap-4" onSubmit={handleSubmit(async (rawValues) => {
      const values = eventSchema.parse(rawValues);
      return onSubmit({
      ...values,
      slug: values.name.toLowerCase().replace(/[^a-z0-9ก-๙]+/gi, "-"),
      startAt: Timestamp.fromDate(new Date(values.startAt)),
      endAt: Timestamp.fromDate(new Date(values.endAt)),
    });
    })}>
      <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" placeholder="ชื่อกิจกรรม" {...register("name")} />
      <textarea className="min-h-28 rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" placeholder="รายละเอียดกิจกรรม" {...register("description")} />
      <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" placeholder="สถานที่" {...register("location")} />
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" type="datetime-local" {...register("startAt")} />
        <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" type="datetime-local" {...register("endAt")} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <select className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" {...register("status")}><option value="draft">draft</option><option value="published">published</option><option value="active">active</option><option value="completed">completed</option><option value="archived">archived</option></select>
        <select className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" {...register("visibility")}><option value="public">public</option><option value="private">private</option><option value="inviteOnly">inviteOnly</option></select>
        <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" type="number" min={1} {...register("maxDwellMinutesPerStation")} />
      </div>
      {Object.values(errors)[0]?.message ? <p className="text-sm text-amber-200">{Object.values(errors)[0]?.message}</p> : null}
      <NeonButton type="submit" disabled={isSubmitting}><Save size={16} /> บันทึกกิจกรรม</NeonButton>
    </form>
  );
}
