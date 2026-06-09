import type { EventRole, GlobalRole } from "@/types/role";

const label: Record<GlobalRole | EventRole, string> = {
  user: "ผู้เข้าร่วม",
  admin: "Admin",
  eventManager: "Event Manager",
  owner: "Owner",
  editor: "Editor",
  viewer: "Viewer",
};

export function RoleBadge({ role }: { role: GlobalRole | EventRole }) {
  return <span className="rounded-md border border-violet-300/35 bg-violet-300/10 px-2 py-1 text-xs font-semibold text-violet-100">{label[role]}</span>;
}

