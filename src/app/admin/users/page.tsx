import { AdminLayout } from "@/components/admin/AdminLayout";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PageHeader } from "@/components/cyber/PageHeader";
import { CyberCard } from "@/components/cyber/CyberCard";

export default function UsersAdminPage() {
  return (
    <AdminLayout>
      <PermissionGate allow="admin" fallback={<CyberCard className="p-5">เฉพาะ Admin เท่านั้น</CyberCard>}>
        <PageHeader title="User Management" description="จัดการ global roles ผ่าน Firestore Console หรือ UI ส่วนขยายในรอบถัดไป" />
        <CyberCard className="p-5">MVP นี้บังคับใช้ role ผ่าน Firestore Rules แล้ว การ bootstrap admin ทำตาม README</CyberCard>
      </PermissionGate>
    </AdminLayout>
  );
}

