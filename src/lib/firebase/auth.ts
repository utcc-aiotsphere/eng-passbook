import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { requireAuth, requireDb } from "./client";

export async function ensureUserProfile(user: { uid: string; displayName: string | null; email: string | null; photoURL?: string | null }) {
  const db = requireDb();
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const base = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split("@")[0] || "UTCC User",
    email: user.email || "",
    photoURL: user.photoURL || null,
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    await setDoc(ref, { ...base, globalRole: "user", disabled: false, createdAt: serverTimestamp() });
  } else {
    await setDoc(ref, base, { merge: true });
  }
}

export async function loginWithGoogle() {
  const auth = requireAuth();
  const credential = await signInWithPopup(auth, new GoogleAuthProvider());
  await ensureUserProfile(credential.user);
}

export async function loginWithEmail(email: string, password: string) {
  const auth = requireAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(credential.user);
}

export async function registerWithEmail(email: string, password: string, displayName: string) {
  const auth = requireAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await ensureUserProfile({ ...credential.user, displayName });
}

export async function logout() {
  await signOut(requireAuth());
}
