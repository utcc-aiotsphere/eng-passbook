import { serverTimestamp, updateDoc } from "firebase/firestore";
import { refs } from "@/lib/firebase/firestore";
import type { AppUser } from "@/types/user";
import type { RewardStatus } from "@/types/reward";
import { writeAuditLog } from "./auditService";

export async function updateRewardEligibility(eventId: string, userId: string, status: RewardStatus, actor: AppUser, note?: string) {
  await updateDoc(refs.participant(eventId, userId), {
    rewardStatus: status,
    rewardNote: note || "",
    rewardUpdatedBy: actor.uid,
    rewardUpdatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await writeAuditLog({ actorId: actor.uid, actorEmail: actor.email, action: `reward.${status}`, targetType: "participant", targetId: userId, eventId, after: { status, note } });
}

