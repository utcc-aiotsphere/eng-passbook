import { AdminSidebar } from "./AdminSidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { CyberCard } from "@/components/cyber/CyberCard";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <PermissionGate allow="manager" fallback={<main className="p-8"><CyberCard className="p-6">ต้องเป็น Admin หรือ Event Manager จึงจะเข้าหน้านี้ได้</CyberCard></main>}>
        <div className="flex">
          <AdminSidebar />
          <main className="min-w-0 flex-1 px-4 pb-24 pt-8 md:px-8">{children}</main>
        </div>
      </PermissionGate>
    </ProtectedRoute>
  );
}

