import { addDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import type { Station } from "@/types/station";
import type { AppUser } from "@/types/user";
import { refs } from "@/lib/firebase/firestore";
import { absoluteAppUrl, buildCheckinPath, randomToken } from "@/utils/qr";
import { writeAuditLog } from "./auditService";

export async function listStations(eventId: string) {
  const snap = await getDocs(query(refs.stations(eventId), orderBy("stationNumber", "asc")));
  return snap.docs.map((item) => ({ stationId: item.id, ...item.data() })) as Station[];
}

export async function createStation(eventId: string, input: Partial<Station>, actor: AppUser) {
  const stationRef = await addDoc(refs.stations(eventId), {
    eventId,
    name: input.name || "ฐานกิจกรรมใหม่",
    description: input.description || "",
    locationLabel: input.locationLabel || "",
    stationNumber: input.stationNumber || 1,
    icon: input.icon || "Cpu",
    color: input.color || "#38D6FF",
    qrUrl: "",
    isRequired: input.isRequired ?? true,
    isActive: input.isActive ?? true,
    estimatedDurationMinutes: input.estimatedDurationMinutes || 10,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const token = randomToken();
  const qrUrl = absoluteAppUrl(buildCheckinPath(eventId, stationRef.id, token));
  await Promise.all([
    setDoc(refs.stationSecret(eventId, stationRef.id), { stationId: stationRef.id, qrToken: token, rotatedAt: serverTimestamp() }),
    updateDoc(stationRef, { qrUrl, updatedAt: serverTimestamp() }),
    writeAuditLog({ actorId: actor.uid, actorEmail: actor.email, action: "station.create", targetType: "station", targetId: stationRef.id, eventId }),
  ]);
  return stationRef.id;
}

export async function updateStation(eventId: string, stationId: string, patch: Partial<Station>, actor: AppUser) {
  await updateDoc(refs.station(eventId, stationId), { ...patch, updatedAt: serverTimestamp() });
  await writeAuditLog({ actorId: actor.uid, actorEmail: actor.email, action: "station.update", targetType: "station", targetId: stationId, eventId, after: patch });
}

export async function regenerateStationQrToken(eventId: string, stationId: string, actor: AppUser) {
  const token = randomToken();
  const qrUrl = absoluteAppUrl(buildCheckinPath(eventId, stationId, token));
  await Promise.all([
    setDoc(refs.stationSecret(eventId, stationId), { stationId, qrToken: token, rotatedAt: serverTimestamp() }),
    updateDoc(refs.station(eventId, stationId), { qrUrl, updatedAt: serverTimestamp() }),
    writeAuditLog({ actorId: actor.uid, actorEmail: actor.email, action: "station.qr.rotate", targetType: "station", targetId: stationId, eventId }),
  ]);
  return { token, qrUrl };
}

