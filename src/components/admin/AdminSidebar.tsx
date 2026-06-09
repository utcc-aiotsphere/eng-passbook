import Link from "next/link";
import { BarChart3, CalendarCog, Gift, QrCode, Shield, Users } from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/events", label: "Events", icon: CalendarCog },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/events", label: "QR Codes", icon: QrCode },
  { href: "/admin/events", label: "Rewards", icon: Gift },
];

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-cyan-300/15 bg-slate-950/55 p-4 lg:block">
      <Link href="/" className="mb-8 flex items-center gap-3 font-black text-cyan-100"><Shield /> UTCC Passbook</Link>
      <nav className="space-y-2">
        {items.map((item) => <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-cyan-300/10 hover:text-cyan-100"><item.icon size={16} /> {item.label}</Link>)}
      </nav>
    </aside>
  );
}

