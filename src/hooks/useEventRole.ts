import type { EventMember } from "@/types/event";

export function useEventRole(member?: EventMember | null) {
  return {
    role: member?.role || null,
    canEdit: member?.role === "owner" || member?.role === "editor",
    canView: member?.status === "active",
  };
}

