export type RewardStatus = "notEligible" | "eligible" | "claimed" | "rejected";

export type RewardClaimUpdate = {
  rewardStatus: RewardStatus;
  note?: string;
  claimedAt?: unknown;
  updatedBy: string;
};

