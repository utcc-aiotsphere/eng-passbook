import { useAuth } from "./useAuth";
import { canCreateEvent, isAdmin, isEventManager } from "@/utils/permissions";

export function usePermission() {
  const { user } = useAuth();
  return {
    isAdmin: isAdmin(user),
    isEventManager: isEventManager(user),
    canCreateEvent: canCreateEvent(user),
  };
}

