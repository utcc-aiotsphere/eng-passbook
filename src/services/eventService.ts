import { addDoc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import type { EventDoc } from "@/types/event";
import type { AppUser } from "@/types/user";
import { refs } from "@/lib/firebase/firestore";
import { writeAuditLog } from "./auditService";

export async function listPublicEvents() {
  const snap = await getDocs(query(refs.events(), where("visibility", "==", "public"), orderBy("startAt", "desc"), limit(30)));
  return snap.docs.map((item) => ({ eventId: item.id, ...item.data() })) as EventDoc[];
}

export async function listAccessibleEvents(user?: AppUser | null) {
  if (!user) return listPublicEvents();
  if (user.globalRole === "admin") {
    const snap = await getDocs(query(refs.events(), orderBy("updatedAt", "desc"), limit(50)));
    return snap.docs.map((item) => ({ eventId: item.id, ...item.data() })) as EventDoc[];
  }
  const snap = await getDocs(query(refs.events(), where("ownerIds", "array-contains", user.uid), limit(50)));
  return snap.docs.map((item) => ({ eventId: item.id, ...item.data() })) as EventDoc[];
}

export async function getEvent(eventId: string) {
  const snap = await getDoc(refs.event(eventId));
  return snap.exists() ? ({ eventId: snap.id, ...snap.data() } as EventDoc) : null;
}

export async function createEvent(input: Partial<EventDoc>, actor: AppUser) {
  const ref = await addDoc(refs.events(), {
    name: input.name || "กิจกรรมใหม่",
    slug: input.slug || crypto.randomUUID(),
    description: input.description || "",
    coverImageUrl: input.coverImageUrl || "",
    themePreset: input.themePreset || "hologram-ops",
    location: input.location || "",
    startAt: input.startAt || serverTimestamp(),
    endAt: input.endAt || serverTimestamp(),
    status: input.status || "draft",
    createdBy: actor.uid,
    ownerIds: [actor.uid],
    managerIds: [],
    visibility: input.visibility || "public",
    requiredStationMode: input.requiredStationMode || "all",
    requiredStationIds: input.requiredStationIds || [],
    maxDwellMinutesPerStation: input.maxDwellMinutesPerStation || 30,
    allowRepeatCheckin: input.allowRepeatCheckin ?? false,
    rewardEnabled: input.rewardEnabled ?? true,
    rewardName: input.rewardName || "UTCC ENG Passbook Completion Reward",
    rewardDescription: input.rewardDescription || "",
    rewardClaimInstructions: input.rewardClaimInstructions || "",
    badgeEnabled: input.badgeEnabled ?? true,
    badgeTemplate: input.badgeTemplate || {
      badgeTitle: "AIoT Sphere Explorer",
      subtitle: "UTCC Engineering",
      badgeLevel: "Explorer",
      badgeIcon: "AI",
      colorTheme: "cyan",
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(refs.member(ref.id, actor.uid), {
    userId: actor.uid,
    email: actor.email,
    role: "owner",
    invitedBy: actor.uid,
    invitedAt: serverTimestamp(),
    acceptedAt: serverTimestamp(),
    status: "active",
  });
  await writeAuditLog({ actorId: actor.uid, actorEmail: actor.email, action: "event.create", targetType: "event", targetId: ref.id, eventId: ref.id });
  return ref.id;
}

export async function updateEvent(eventId: string, patch: Partial<EventDoc>, actor: AppUser) {
  await updateDoc(refs.event(eventId), { ...patch, updatedAt: serverTimestamp() });
  await writeAuditLog({ actorId: actor.uid, actorEmail: actor.email, action: "event.update", targetType: "event", targetId: eventId, eventId, after: patch });
}

export async function archiveEvent(eventId: string, actor: AppUser) {
  await updateEvent(eventId, { status: "archived" }, actor);
}

export async function duplicateEvent(eventId: string, actor: AppUser) {
  const source = await getEvent(eventId);
  if (!source) throw new Error("Event not found");
  return createEvent({ ...source, name: `${source.name} (Copy)`, status: "draft" }, actor);
}
