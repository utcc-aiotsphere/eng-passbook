import Link from "next/link";
import { ArrowRight, BookOpenCheck, Cpu, QrCode, Trophy } from "lucide-react";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { th } from "@/constants/labels";

const features = [
  { icon: QrCode, title: "QR Station Check-in", copy: "สแกน QR ประจำฐาน บันทึกเวลาเข้าออก และปิด session เดิมอัตโนมัติ" },
  { icon: BookOpenCheck, title: "Digital Passbook", copy: "ดูฐานที่ผ่านแล้ว ฐานที่เหลือ Badge และสถานะรางวัลในมือถือ" },
  { icon: Trophy, title: "Leaderboard & Rewards", copy: "จัดอันดับตามเวลาที่อยู่ในฐาน ตรวจสิทธิ์รับของรางวัล และ export ข้อมูล" },
  { icon: Cpu, title: "Firebase Secured", copy: "สิทธิ์ Admin, Event Manager, Viewer และ Editor ถูกคุมด้วย Firestore Rules" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-8 md:pt-12">
      <nav className="mb-12 flex items-center justify-between">
        <Link href="/" className="font-black text-cyan-100">UTCC ENG Passbook</Link>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/events" className="text-sm text-slate-300 hover:text-cyan-100">กิจกรรม</Link>
          <Link href="/app/passbook" className="text-sm text-slate-300 hover:text-cyan-100">Passbook</Link>
          <Link href="/admin" className="text-sm text-slate-300 hover:text-cyan-100">Admin</Link>
        </div>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-start">
        <section>
          <PageHeader
            eyebrow="Powered by UTCC AIoT Sphere"
            title="UTCC ENG Passbook"
            description="แพลตฟอร์ม event passport สำหรับกิจกรรมวิศวกรรมศาสตร์ UTCC: สแกนฐาน สะสมความคืบหน้า ปลดล็อก Badge และตรวจสิทธิ์รางวัลแบบ Cyberpunk Hologram Ops"
            action={<NeonButton href="/events">ดู Event ที่เปิดอยู่ <ArrowRight size={16} /></NeonButton>}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <CyberCard key={feature.title} className="p-5">
                <feature.icon className="mb-4 text-cyan-300" />
                <h2 className="text-lg font-bold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{feature.copy}</p>
              </CyberCard>
            ))}
          </div>
        </section>
        <LoginPanel />
      </div>
      <CyberCard className="mt-8 p-6">
        <p className="text-center text-sm text-cyan-100">{th.scanToCheckIn} • {th.passbook} • {th.badgeUnlocked} • {th.powered}</p>
      </CyberCard>
    </main>
  );
}

