"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { QrCode } from "lucide-react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { checkInStation } from "@/services/checkinService";

export default function CheckinPage() {
  const { eventId, stationId } = useParams<{ eventId: string; stationId: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const token = useMemo(() => params.get("token") || "", [params]);
  const [message, setMessage] = useState("กำลังตรวจสอบ QR Code...");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user || done) return;
    if (!token) {
      setMessage("QR Code ไม่ถูกต้อง: ไม่มี token");
      return;
    }
    checkInStation({ eventId, stationId, token, user })
      .then((result) => {
        setDone(true);
        setMessage(result.repeated ? "คุณผ่านฐานนี้แล้ว" : "เช็กอินสำเร็จ ระบบบันทึกฐานนี้ใน Passbook แล้ว");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "เช็กอินไม่สำเร็จ"));
  }, [done, eventId, stationId, token, user]);

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 md:px-8">
        <PageHeader title="สแกนเพื่อเช็กอิน" description="ระบบกำลังตรวจสอบกิจกรรม ฐาน และ QR token ผ่าน Firebase Security Rules" />
        <CyberCard className="p-8 text-center">
          <QrCode className="mx-auto mb-4 text-cyan-300" size={56} />
          <p className="text-lg font-bold">{message}</p>
          <NeonButton className="mt-6" onClick={() => router.push(`/app/passbook/${eventId}`)}>เปิด Passbook</NeonButton>
        </CyberCard>
      </main>
    </ProtectedRoute>
  );
}

