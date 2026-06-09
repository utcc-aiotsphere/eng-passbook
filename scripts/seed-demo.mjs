import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

async function loadEnvFile(fileName) {
  try {
    const content = await readFile(join(process.cwd(), fileName), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

await loadEnvFile(".env.local");

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "https://utcc-aiotsphere.github.io/eng-passbook";
const adminUid = process.env.SEED_ADMIN_UID;
const adminEmail = process.env.SEED_ADMIN_EMAIL;

function validateServiceAccountKey(key) {
  const missing = ["type", "project_id", "private_key", "client_email"].filter((field) => !key[field]);
  if (missing.length) {
    throw new Error(`Invalid Firebase service account JSON. Missing: ${missing.join(", ")}`);
  }
  if (key.type !== "service_account") {
    throw new Error(`Invalid Firebase service account JSON. Expected type service_account, received ${key.type}.`);
  }
  if (key.project_id !== projectId) {
    throw new Error(`Service account project_id ${key.project_id} does not match FIREBASE_PROJECT_ID ${projectId}.`);
  }
}

async function credential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    validateServiceAccountKey(key);
    return cert(key);
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccountPath = isAbsolute(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      ? process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      : resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const key = JSON.parse(await readFile(serviceAccountPath, "utf8"));
    validateServiceAccountKey(key);
    return cert(key);
  }
  return applicationDefault();
}

if (!projectId) {
  throw new Error("Set FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID before running seed:demo.");
}

const app = getApps()[0] || initializeApp({ credential: await credential(), projectId });

const db = getFirestore(app);
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
      "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/service-account.json, GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json, or FIREBASE_SERVICE_ACCOUNT_KEY with the service account JSON.",
    );
  }
  if (error instanceof Error && (error.message.includes("UNAUTHENTICATED") || error.message.includes("invalid authentication credentials"))) {
    throw new Error(
      "Firebase rejected the service account credentials. Generate a new private key in Firebase Console > Project settings > Service accounts, update FIREBASE_SERVICE_ACCOUNT_PATH, then run npm run seed:demo again.",
    );
  }
  throw error;
}

console.log(`Seeded demo data into project ${projectId}.`);
console.log(`Event: demo-aiot-open-house`);
console.log(`Stations: ${seed.stations.length}`);
if (adminUid) console.log(`Admin user: ${adminUid}`);
