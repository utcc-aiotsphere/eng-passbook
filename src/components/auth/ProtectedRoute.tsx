"use client";

import { ShieldAlert } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { routes } from "@/constants/routes";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, firebaseReady } = useAuth();
  if (loading) return <CyberCard className="p-6">กำลังโหลดสิทธิ์การเข้าใช้งาน...</CyberCard>;
  if (!firebaseReady) {
    return <CyberCard className="p-6">ยังไม่ได้ตั้งค่า Firebase โปรดเพิ่มไฟล์ `.env.local` ตาม `.env.example`</CyberCard>;
  }
  if (!user) {
    return (
      <CyberCard className="mx-auto mt-16 max-w-lg p-8 text-center">
        <ShieldAlert className="mx-auto mb-4 text-cyan-300" size={42} />
        <h1 className="text-2xl font-bold">กรุณาเข้าสู่ระบบ</h1>
        <p className="mt-2 text-slate-300">ต้องเข้าสู่ระบบก่อนใช้งานสมุดสะสมฐานกิจกรรม</p>
        <NeonButton href={`${routes.home}#login`} className="mt-6">เข้าสู่ระบบ</NeonButton>
      </CyberCard>
    );
  }
  return children;
}
