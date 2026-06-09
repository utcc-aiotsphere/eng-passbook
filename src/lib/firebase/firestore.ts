import { collection, doc } from "firebase/firestore";
import { requireDb } from "./client";

export const refs = {
  user: (userId: string) => doc(requireDb(), "users", userId),
  events: () => collection(requireDb(), "events"),
  event: (eventId: string) => doc(requireDb(), "events", eventId),
  stations: (eventId: string) => collection(requireDb(), "events", eventId, "stations"),
  station: (eventId: string, stationId: string) => doc(requireDb(), "events", eventId, "stations", stationId),
  stationSecret: (eventId: string, stationId: string) => doc(requireDb(), "events", eventId, "stationSecrets", stationId),
  participants: (eventId: string) => collection(requireDb(), "events", eventId, "participants"),
  participant: (eventId: string, userId: string) => doc(requireDb(), "events", eventId, "participants", userId),
  checkins: (eventId: string) => collection(requireDb(), "events", eventId, "checkins"),
  checkin: (eventId: string, checkinId: string) => doc(requireDb(), "events", eventId, "checkins", checkinId),
  members: (eventId: string) => collection(requireDb(), "events", eventId, "members"),
  member: (eventId: string, userId: string) => doc(requireDb(), "events", eventId, "members", userId),
  userBadges: () => collection(requireDb(), "userBadges"),
  userBadge: (badgeId: string) => doc(requireDb(), "userBadges", badgeId),
  auditLogs: () => collection(requireDb(), "auditLogs"),
  invites: () => collection(requireDb(), "invites"),
  invite: (inviteId: string) => doc(requireDb(), "invites", inviteId),
};
