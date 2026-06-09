import { addDoc, serverTimestamp } from "firebase/firestore";
import { refs } from "@/lib/firebase/firestore";

export async function writeAuditLog(input: {
  actorId: string;
  actorEmail?: string;
  action: string;
  targetType: string;
  targetId: string;
  eventId?: string;
  before?: unknown;
  after?: unknown;
}) {
  await addDoc(refs.auditLogs(), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

