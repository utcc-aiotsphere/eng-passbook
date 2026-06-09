import type { EventDoc, EventMember } from "@/types/event";
import type { AppUser } from "@/types/user";

export function isAdmin(user?: Pick<AppUser, "globalRole"> | null) {
  return user?.globalRole === "admin";
}

export function isEventManager(user?: Pick<AppUser, "globalRole"> | null) {
  return user?.globalRole === "eventManager" || isAdmin(user);
}

export function canCreateEvent(user?: Pick<AppUser, "globalRole"> | null) {
  return isEventManager(user);
}

export function canManageEvent(user: AppUser | null | undefined, event?: EventDoc | null, member?: EventMember | null) {
  if (!user || !event) return false;
  if (isAdmin(user)) return true;
  if (event.ownerIds?.includes(user.uid) || event.managerIds?.includes(user.uid)) return true;
  return member?.status === "active" && (member.role === "owner" || member.role === "editor");
}

export function canDeleteEvent(user: AppUser | null | undefined, event?: EventDoc | null, member?: EventMember | null) {
  if (!user || !event) return false;
  if (isAdmin(user)) return true;
  return event.ownerIds?.includes(user.uid) || (member?.status === "active" && member.role === "owner");
}

export function canViewEvent(user: AppUser | null | undefined, event?: EventDoc | null, member?: EventMember | null) {
  if (!event) return false;
  if (event.visibility === "public") return true;
  if (!user) return false;
  if (canManageEvent(user, event, member)) return true;
  return member?.status === "active" && member.role === "viewer";
}

