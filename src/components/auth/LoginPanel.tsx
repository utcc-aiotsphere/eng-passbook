"use client";

import { useState } from "react";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { loginWithEmail, loginWithGoogle, logout, registerWithEmail } from "@/lib/firebase/auth";
import { useAuth } from "./AuthProvider";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { RoleBadge } from "@/components/RoleBadge";

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return "เข้าสู่ระบบไม่สำเร็จ";

  if ("code" in error && error.code === "auth/unauthorized-domain") {
    return "โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase Console โปรดเพิ่ม utcc-aiotsphere.github.io ใน Authentication > Settings > Authorized domains";
  }

  if (
    "code" in error &&
    (error.code === "auth/configuration-not-found" || error.code === "auth/operation-not-allowed")
  ) {
    return "ยังไม่ได้เปิดวิธีเข้าสู่ระบบนี้ใน Firebase Console โปรดเปิด Email/Password และ Google ใน Authentication > Sign-in method";
  }

  return error.message;
}

export function LoginPanel() {
  const { user, firebaseReady } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      if (mode === "login") await loginWithEmail(email, password);
      else await registerWithEmail(email, password, displayName);
      setMessage("เข้าสู่ระบบสำเร็จ");
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    }
  }

  async function signOut() {
    setLoggingOut(true);
    setMessage("");
    try {
      await logout();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ออกจากระบบไม่สำเร็จ");
    } finally {
      setLoggingOut(false);
    }
  }

  if (user) {
    return (
      <CyberCard className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="font-bold">เข้าสู่ระบบแล้ว: {user.displayName}</p>
              <RoleBadge role={user.globalRole} />
            </div>
            <p className="text-sm text-slate-300">{user.email}</p>
          </div>
          <NeonButton className="shrink-0 border-rose-300/55 bg-rose-300/12" onClick={signOut} disabled={loggingOut}>
            <LogOut size={16} /> {loggingOut ? "กำลังออก..." : "Logout"}
          </NeonButton>
        </div>
        {message ? <p className="mt-3 text-sm text-amber-100">{message}</p> : null}
      </CyberCard>
    );
  }
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
      <NeonButton className="mt-3 w-full border-violet-300/55 bg-violet-300/12" onClick={() => loginWithGoogle().catch((error) => setMessage(getAuthErrorMessage(error)))}>เข้าสู่ระบบด้วย Google</NeonButton>
      {message ? <p className="mt-3 text-sm text-amber-100">{message}</p> : null}
    </CyberCard>
  );
}
