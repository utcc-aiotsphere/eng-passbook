import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "https://utcc-aiotsphere.github.io/eng-passbook";
const adminUid = process.env.SEED_ADMIN_UID;
const adminEmail = process.env.SEED_ADMIN_EMAIL;

function credential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY));
  }
  return applicationDefault();
}

if (!projectId) {
  throw new Error("Set FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID before running seed:demo.");
}

if (!getApps().length) {
  initializeApp({ credential: credential(), projectId });
}

const db = getFirestore();
const seedPath = join(process.cwd(), "seed", "demo-seed.json");
const seed = JSON.parse(await readFile(seedPath, "utf8"));
const now = FieldValue.serverTimestamp();

function qrToken(stationId) {
  return `demo-${stationId}-token`;
}

const batch = db.batch();

for (const [eventId, event] of Object.entries(seed.events)) {
  const eventRef = db.collection("events").doc(eventId);
  batch.set(eventRef, {
    ...event,
    startAt: now,
    endAt: now,
    createdBy: adminUid || "seed",
    ownerIds: adminUid ? [adminUid] : [],
    managerIds: [],
    requiredStationIds: seed.stations.filter((station) => station.isRequired).map((station) => station.stationId),
    rewardDescription: event.rewardDescription || "",
    rewardClaimInstructions: event.rewardClaimInstructions || "ติดต่อเจ้าหน้าที่ประจำงานเพื่อรับรางวัล",
    createdAt: now,
    updatedAt: now,
  });

  if (adminUid && adminEmail) {
    batch.set(eventRef.collection("members").doc(adminUid), {
      userId: adminUid,
      email: adminEmail,
      role: "owner",
      invitedBy: "seed",
      invitedAt: now,
      acceptedAt: now,
      status: "active",
    });
  }

  for (const station of seed.stations) {
    const token = qrToken(station.stationId);
    const qrUrl = `${appBaseUrl}/checkin/${eventId}/${station.stationId}?token=${encodeURIComponent(token)}`;
    batch.set(eventRef.collection("stations").doc(station.stationId), {
      ...station,
      eventId,
      description: station.description || "",
      icon: station.icon || "cpu",
      color: station.color || "cyan",
      qrUrl,
      isActive: station.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
    batch.set(eventRef.collection("stationSecrets").doc(station.stationId), {
      stationId: station.stationId,
      qrToken: token,
      rotatedAt: now,
    });
  }
}

if (adminUid && adminEmail) {
  batch.set(db.collection("users").doc(adminUid), {
    uid: adminUid,
    displayName: process.env.SEED_ADMIN_NAME || adminEmail.split("@")[0],
    email: adminEmail,
    photoURL: null,
    globalRole: "admin",
    disabled: false,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  }, { merge: true });
}

try {
  await batch.commit();
} catch (error) {
  if (error instanceof Error && error.message.includes("Could not load the default credentials")) {
    throw new Error(
      "Missing Firebase Admin credentials. Set GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json or FIREBASE_SERVICE_ACCOUNT_KEY with the service account JSON.",
    );
  }
  throw error;
}

console.log(`Seeded demo data into project ${projectId}.`);
console.log(`Event: demo-aiot-open-house`);
console.log(`Stations: ${seed.stations.length}`);
if (adminUid) console.log(`Admin user: ${adminUid}`);
