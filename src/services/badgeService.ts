import { addDoc, getDoc, getDocs, limit, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import type { EventDoc, Participant } from "@/types/event";
import type { UserBadge } from "@/types/badge";
import { refs } from "@/lib/firebase/firestore";

export async function listUserBadges(userId: string) {
  const snap = await getDocs(query(refs.userBadges(), where("userId", "==", userId), limit(50)));
  return snap.docs.map((item) => ({ badgeId: item.id, ...item.data() })) as UserBadge[];
}

export async function getUserBadge(badgeId: string) {
  const snap = await getDoc(refs.userBadge(badgeId));
  return snap.exists() ? ({ badgeId: snap.id, ...snap.data() } as UserBadge) : null;
}

export async function createUserBadge(event: EventDoc, participant: Participant) {
  const config = event.badgeTemplate || {
    badgeTitle: "AIoT Sphere Explorer",
    badgeLevel: "Explorer",
    badgeIcon: "AI",
    colorTheme: "cyan",
  };
  const badgeRef = await addDoc(refs.userBadges(), {
    eventId: event.eventId,
    userId: participant.userId,
    displayName: participant.displayName,
    eventName: event.name,
    badgeTitle: config.badgeTitle,
    badgeLevel: config.badgeLevel,
    issuedAt: serverTimestamp(),
    verificationCode: crypto.randomUUID().slice(0, 12).toUpperCase(),
    badgeConfigSnapshot: config,
    status: "active",
  });
  await updateDoc(refs.participant(event.eventId, participant.userId), {
    badgeUnlocked: true,
    badgeId: badgeRef.id,
    updatedAt: serverTimestamp(),
  });
  return badgeRef.id;
}

