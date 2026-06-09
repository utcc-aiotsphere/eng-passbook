"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { getUserBadge } from "@/services/badgeService";
import type { UserBadge } from "@/types/badge";

export default function VerifyBadgePage() {
  const { badgeId } = useParams<{ badgeId: string }>();
  const [badge, setBadge] = useState<UserBadge | null>(null);
  useEffect(() => { getUserBadge(badgeId).then(setBadge); }, [badgeId]);
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 md:px-8">
      <PageHeader title="ตรวจสอบ Badge" description="หน้า verification สาธารณะสำหรับ Badge ที่ออกโดย UTCC ENG Passbook" />
      <CyberCard className="p-8 text-center">
        <BadgeCheck className="mx-auto mb-4 text-emerald-300" size={56} />
        {badge ? (
          <>
            <h2 className="text-2xl font-black">{badge.badgeTitle}</h2>
            <p className="mt-2 text-slate-300">{badge.displayName} • {badge.eventName}</p>
            <p className="mt-3 text-cyan-100">Verification: {badge.verificationCode}</p>
            <div className="mx-auto mt-5 w-40 rounded-md bg-white p-3"><QRCode value={typeof window !== "undefined" ? window.location.href : badgeId} /></div>
          </>
        ) : <p>ไม่พบ Badge หรือ Badge ถูกเพิกถอน</p>}
      </CyberCard>
    </main>
  );
}

