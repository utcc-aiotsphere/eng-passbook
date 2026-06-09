"use client";

import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { loginWithEmail, loginWithGoogle, registerWithEmail } from "@/lib/firebase/auth";
import { useAuth } from "./AuthProvider";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";

export function LoginPanel() {
  const { user, firebaseReady } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      if (mode === "login") await loginWithEmail(email, password);
      else await registerWithEmail(email, password, displayName);
      setMessage("เข้าสู่ระบบสำเร็จ");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ");
    }
  }

  if (user) return <CyberCard className="p-5">เข้าสู่ระบบแล้ว: {user.displayName}</CyberCard>;
  if (!firebaseReady) return <CyberCard className="p-5">เพิ่มค่า Firebase ใน `.env.local` เพื่อเปิดระบบเข้าสู่ระบบจริง</CyberCard>;

  return (
    <CyberCard id="login" className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">{mode === "login" ? "เข้าสู่ระบบ" : "สมัครผู้เข้าร่วม"}</h2>
        <button className="text-sm text-cyan-200 underline" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "สมัครใหม่" : "มีบัญชีแล้ว"}</button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" ? <input className="w-full rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" placeholder="ชื่อ-นามสกุล" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required /> : null}
        <input className="w-full rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" type="email" placeholder="อีเมล" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <input className="w-full rounded-md border border-cyan-300/25 bg-slate-950/70 px-3 py-3" type="password" placeholder="รหัสผ่าน" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
        <NeonButton className="w-full" type="submit">{mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />} {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</NeonButton>
      </form>
      <NeonButton className="mt-3 w-full border-violet-300/55 bg-violet-300/12" onClick={() => loginWithGoogle().catch((error) => setMessage(error.message))}>เข้าสู่ระบบด้วย Google</NeonButton>
      {message ? <p className="mt-3 text-sm text-amber-100">{message}</p> : null}
    </CyberCard>
  );
}

