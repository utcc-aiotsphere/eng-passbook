import { appBasePath } from "@/constants/routes";

export function randomToken(bytes = 24) {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function buildCheckinPath(eventId: string, stationId: string, token: string) {
  return `${appBasePath}/checkin/${eventId}/${stationId}/?token=${encodeURIComponent(token)}`;
}

export function absoluteAppUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${path}`;
}

