"use client";

import Link from "next/link";
import { BookOpen, Home, QrCode, Shield } from "lucide-react";

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-cyan-300/20 bg-slate-950/90 p-2 backdrop-blur lg:hidden">
      {[
        { href: "/", label: "Home", icon: Home },
        { href: "/events", label: "Events", icon: QrCode },
        { href: "/app/passbook", label: "Passbook", icon: BookOpen },
        { href: "/admin", label: "Admin", icon: Shield },
      ].map((item) => <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 text-[11px] text-slate-300"><item.icon size={18} /> {item.label}</Link>)}
    </nav>
  );
}

