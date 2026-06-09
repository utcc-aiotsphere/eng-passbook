"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CyberCard } from "@/components/cyber/CyberCard";
import { BadgePreview } from "@/components/badge/BadgePreview";
import { useAuth } from "@/hooks/useAuth";
import { listUserBadges } from "@/services/badgeService";
import type { UserBadge } from "@/types/badge";

export default function BadgesPage() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  useEffect(() => { if (user) listUserBadges(user.uid).then(setBadges); }, [user]);
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:px-8">
        <PageHeader title="Badges" description="Badge ที่ปลดล็อกจากกิจกรรม UTCC Engineering" />
        <div className="grid gap-5 md:grid-cols-2">{badges.map((badge) => <CyberCard key={badge.badgeId} className="p-5"><BadgePreview config={badge.badgeConfigSnapshot} participantName={badge.displayName} eventName={badge.eventName} /><p className="mt-3 text-cyan-100">{badge.verificationCode}</p></CyberCard>)}</div>
      </main>
    </ProtectedRoute>
  );
}

