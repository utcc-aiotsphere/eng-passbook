"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db, firebaseReady } from "@/lib/firebase/client";
import { ensureUserProfile } from "@/lib/firebase/auth";
import type { AppUser } from "@/types/user";

type AuthContextValue = {
  firebaseReady: boolean;
  firebaseUser: User | null;
  user: AppUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ firebaseReady, firebaseUser: null, user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(firebaseReady);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return undefined;
    }
    const activeAuth = auth;
    const activeDb = db;
    return onAuthStateChanged(activeAuth, async (current) => {
      setFirebaseUser(current);
      if (!current) {
        setUser(null);
        setLoading(false);
        return;
      }
      await ensureUserProfile(current);
      const snap = await getDoc(doc(activeDb, "users", current.uid));
      setUser(snap.exists() ? (snap.data() as AppUser) : null);
      setLoading(false);
    });
  }, []);

  const value = useMemo(() => ({ firebaseReady, firebaseUser, user, loading }), [firebaseUser, loading, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
