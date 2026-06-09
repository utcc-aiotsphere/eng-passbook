import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";

export default function AppDashboardPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 md:px-8">
        <PageHeader title="User Dashboard" description="ศูนย์รวม Passbook, Badge และ Leaderboard ของผู้เข้าร่วม" />
        <div className="grid gap-4 md:grid-cols-3">
          <CyberCard className="p-5"><h2 className="font-bold">Passbook</h2><p className="mt-2 text-sm text-slate-300">ดู event ที่เข้าร่วม</p><NeonButton href="/app/passbook" className="mt-4">เปิด</NeonButton></CyberCard>
          <CyberCard className="p-5"><h2 className="font-bold">Badges</h2><p className="mt-2 text-sm text-slate-300">Badge ที่ปลดล็อกแล้ว</p><NeonButton href="/app/badges" className="mt-4">เปิด</NeonButton></CyberCard>
          <CyberCard className="p-5"><h2 className="font-bold">Events</h2><p className="mt-2 text-sm text-slate-300">เลือกกิจกรรมใหม่</p><NeonButton href="/events" className="mt-4">ดู Events</NeonButton></CyberCard>
        </div>
      </main>
    </ProtectedRoute>
  );
}

