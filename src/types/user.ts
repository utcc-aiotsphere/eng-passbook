import type { GlobalRole } from "./role";

export type AppUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
  globalRole: GlobalRole;
  studentId?: string;
  phone?: string;
  organization?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
  disabled?: boolean;
};

