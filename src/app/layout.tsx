import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { MobileNav } from "@/components/admin/MobileNav";

export const metadata: Metadata = {
  title: "UTCC ENG Passbook",
  description: "Cyberpunk event passbook powered by UTCC AIoT Sphere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full bg-[#050816] text-slate-100">
        <AuthProvider>
          <div className="cyber-shell min-h-screen">
            {children}
            <MobileNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
