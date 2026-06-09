"use client";

import { useAuth } from "./AuthProvider";
import { isAdmin, isEventManager } from "@/utils/permissions";

export function PermissionGate({
  allow,
  children,
  fallback = null,
}: {
  allow: "admin" | "manager" | "signedIn";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();
  const ok = allow === "signedIn" ? Boolean(user) : allow === "admin" ? isAdmin(user) : isEventManager(user);
  return ok ? children : fallback;
}

