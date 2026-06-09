"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EventForm } from "@/components/admin/EventForm";
import { useAuth } from "@/hooks/useAuth";
import { createEvent } from "@/services/eventService";

export default function NewEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <AdminLayout>
      <PageHeader title="สร้างกิจกรรมใหม่" description="ตั้งค่ากิจกรรม ฐาน Badge และ Reward สำหรับ UTCC ENG Passbook" />
      <CyberCard className="p-6">
        <EventForm onSubmit={async (values) => { if (!user) return; const id = await createEvent(values, user); router.push(`/admin/events/${id}`); }} />
      </CyberCard>
    </AdminLayout>
  );
}

