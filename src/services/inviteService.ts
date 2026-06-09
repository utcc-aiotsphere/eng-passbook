import { addDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { refs } from "@/lib/firebase/firestore";
import type { AppUser } from "@/types/user";
import type { EventRole } from "@/types/role";
import { writeAuditLog } from "./auditService";

export async function inviteEventMember(eventId: string, email: string, role: Exclude<EventRole, "owner">, actor: AppUser) {
  const ref = await addDoc(refs.invites(), {
    eventId,
    email,
    role,
    invitedBy: actor.uid,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  await writeAuditLog({ actorId: actor.uid, actorEmail: actor.email, action: "member.invite", targetType: "invite", targetId: ref.id, eventId, after: { email, role } });
  return ref.id;
}

export async function acceptEventInvite(inviteId: string, eventId: string, user: AppUser, role: EventRole) {
  await Promise.all([
    setDoc(refs.member(eventId, user.uid), {
      userId: user.uid,
      email: user.email,
      role,
      invitedBy: "",
      invitedAt: serverTimestamp(),
      acceptedAt: serverTimestamp(),
      status: "active",
    }),
    updateDoc(refs.invite(inviteId), { status: "accepted", acceptedAt: serverTimestamp() }).catch(() => undefined),
  ]);
}
