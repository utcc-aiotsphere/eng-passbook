"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { useAuth } from "@/hooks/useAuth";
import { inviteEventMember } from "@/services/inviteService";

export default function MembersPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"viewer" | "editor">("viewer");
  const [message, setMessage] = useState("");
  return (
    <AdminLayout>
      <PageHeader title="Event Collaborators" description="เชิญ Viewer หรือ Editor สำหรับกิจกรรมนี้" />
      <CyberCard className="p-5">
        <form className="grid gap-3 md:grid-cols-[1fr_180px_auto]" onSubmit={async (event) => { event.preventDefault(); if (!user) return; await inviteEventMember(eventId, email, role, user); setMessage("บันทึก invite แล้ว"); }}>
          <input className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" type="email" placeholder="email@utcc.ac.th" value={email} onChange={(event) => setEmail(event.target.value)} />
          <select className="rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" value={role} onChange={(event) => setRole(event.target.value as "viewer" | "editor")}><option value="viewer">Viewer</option><option value="editor">Editor</option></select>
          <NeonButton type="submit">Invite</NeonButton>
        </form>
        {message ? <p className="mt-3 text-cyan-100">{message}</p> : null}
      </CyberCard>
    </AdminLayout>
  );
}

