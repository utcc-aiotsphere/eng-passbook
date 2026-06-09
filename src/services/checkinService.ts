import { addDoc, getDoc, getDocs, increment, limit, query, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import type { EventDoc, Participant } from "@/types/event";
import type { AppUser } from "@/types/user";
import { refs } from "@/lib/firebase/firestore";
import { requireDb } from "@/lib/firebase/client";
import { calculateProgress } from "@/utils/progress";
import { calculateValidDwellTime } from "@/utils/time";
import { listStations } from "./stationService";
import { createUserBadge } from "./badgeService";

export async function joinEvent(event: EventDoc, user: AppUser) {
  const stations = await listStations(event.eventId);
  const progress = calculateProgress(event, stations, []);
  await updateDoc(refs.user(user.uid), { lastLoginAt: serverTimestamp() }).catch(() => undefined);
  await runTransaction(requireDb(), async (transaction) => {
    const participantRef = refs.participant(event.eventId, user.uid);
    const snap = await transaction.get(participantRef);
    if (!snap.exists()) {
      transaction.set(participantRef, {
        userId: user.uid,
        displayName: user.displayName,
        email: user.email,
        joinedAt: serverTimestamp(),
        completedStationIds: [],
        requiredCompletedCount: progress.requiredCompletedCount,
        totalRequiredCount: progress.totalRequiredCount,
        progressPercent: progress.progressPercent,
        badgeUnlocked: false,
        rewardStatus: "notEligible",
        totalValidDwellSeconds: 0,
        lastActiveStationId: null,
        activeSessionId: null,
        updatedAt: serverTimestamp(),
      });
    }
  });
}

export async function getParticipant(eventId: string, userId: string) {
  const snap = await getDoc(refs.participant(eventId, userId));
  return snap.exists() ? (snap.data() as Participant) : null;
}

export async function checkInStation({ eventId, stationId, token, user }: { eventId: string; stationId: string; token: string; user: AppUser }) {
  const eventSnap = await getDoc(refs.event(eventId));
  const stationSnap = await getDoc(refs.station(eventId, stationId));
  if (!eventSnap.exists()) throw new Error("ไม่พบกิจกรรม");
  if (!stationSnap.exists()) throw new Error("ไม่พบฐานกิจกรรม");
  const event = { eventId: eventSnap.id, ...eventSnap.data() } as EventDoc;
  if (event.status !== "active" && event.status !== "published") throw new Error("กิจกรรมยังไม่เปิดให้เช็กอิน");
  await joinEvent(event, user);
  const participant = await getParticipant(eventId, user.uid);
  if (!participant) throw new Error("ไม่พบข้อมูลผู้เข้าร่วม");
  if (!event.allowRepeatCheckin && participant.completedStationIds.includes(stationId)) return { repeated: true, participant };
  await closeActiveStationSession(eventId, user.uid, event.maxDwellMinutesPerStation);
  const checkinRef = await addDoc(refs.checkins(eventId), {
    userId: user.uid,
    stationId,
    token,
    checkInAt: serverTimestamp(),
    status: "active",
    source: "qr",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const completedStationIds = Array.from(new Set([...participant.completedStationIds, stationId]));
  const stations = await listStations(eventId);
  const progress = calculateProgress(event, stations, completedStationIds);
  await updateDoc(refs.participant(eventId, user.uid), {
    completedStationIds,
    requiredCompletedCount: progress.requiredCompletedCount,
    totalRequiredCount: progress.totalRequiredCount,
    progressPercent: progress.progressPercent,
    completedAt: progress.completed ? serverTimestamp() : participant.completedAt || null,
    rewardStatus: progress.completed && event.rewardEnabled ? "eligible" : participant.rewardStatus,
    lastActiveStationId: stationId,
    activeSessionId: checkinRef.id,
    updatedAt: serverTimestamp(),
  });
  const updatedParticipant = await getParticipant(eventId, user.uid);
  if (updatedParticipant && progress.completed && event.badgeEnabled && !updatedParticipant.badgeUnlocked) {
    await createUserBadge(event, updatedParticipant);
  }
  return { repeated: false, participant: updatedParticipant };
}

export async function closeActiveStationSession(eventId: string, userId: string, maxDwellMinutes: number) {
  const participant = await getParticipant(eventId, userId);
  if (!participant?.activeSessionId) return null;
  const checkinRef = refs.checkin(eventId, participant.activeSessionId);
  const checkinSnap = await getDoc(checkinRef);
  if (!checkinSnap.exists()) return null;
  const checkin = checkinSnap.data();
  const checkInDate = checkin.checkInAt?.toDate?.() as Date | undefined;
  const now = Date.now();
  const result = calculateValidDwellTime({
    checkInMs: checkInDate?.getTime() || now,
    checkOutMs: now,
    maxDwellMinutes,
  });
  await Promise.all([
    updateDoc(checkinRef, {
      checkOutAt: serverTimestamp(),
      durationSeconds: result.durationSeconds,
      validDurationSeconds: result.validDurationSeconds,
      status: result.status,
      updatedAt: serverTimestamp(),
    }),
    updateDoc(refs.participant(eventId, userId), {
      activeSessionId: null,
      lastActiveStationId: null,
      totalValidDwellSeconds: increment(result.validDurationSeconds),
      updatedAt: serverTimestamp(),
    }),
  ]);
  return result;
}

export async function listRecentCheckins(eventId: string) {
  const snap = await getDocs(query(refs.checkins(eventId), limit(20)));
  return snap.docs.map((doc) => ({ checkinId: doc.id, ...doc.data() }));
}
