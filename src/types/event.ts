export type EventStatus = "draft" | "published" | "active" | "completed" | "archived";
export type EventVisibility = "public" | "private" | "inviteOnly";
export type RequiredStationMode = "all" | "selected";

export type RewardConfig = {
  rewardEnabled: boolean;
  rewardName?: string;
  rewardDescription?: string;
  rewardQuantity?: number;
  claimInstructions?: string;
  claimLocation?: string;
  claimStartAt?: unknown;
  claimEndAt?: unknown;
};

export type EventDoc = RewardConfig & {
  eventId: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  themePreset: string;
  location: string;
  startAt: unknown;
  endAt: unknown;
  status: EventStatus;
  createdBy: string;
  ownerIds: string[];
  managerIds: string[];
  visibility: EventVisibility;
  requiredStationMode: RequiredStationMode;
  requiredStationIds: string[];
  maxDwellMinutesPerStation: number;
  allowRepeatCheckin: boolean;
  rewardDescription?: string;
  rewardClaimInstructions?: string;
  badgeEnabled: boolean;
  badgeTemplate?: BadgeTemplateConfig;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type BadgeLevel = "Explorer" | "Innovator" | "Builder" | "AIoT Champion";

export type BadgeTemplateConfig = {
  badgeTitle: string;
  subtitle?: string;
  badgeLevel: BadgeLevel;
  badgeIcon: string;
  colorTheme: "cyan" | "violet" | "magenta" | "amber";
  sponsorLogoUrl?: string;
};

export type EventMember = {
  userId: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  invitedBy: string;
  invitedAt?: unknown;
  acceptedAt?: unknown;
  status: "pending" | "active" | "removed";
};

export type Participant = {
  userId: string;
  displayName: string;
  email: string;
  joinedAt?: unknown;
  completedStationIds: string[];
  requiredCompletedCount: number;
  totalRequiredCount: number;
  progressPercent: number;
  completedAt?: unknown;
  badgeUnlocked: boolean;
  badgeId?: string;
  rewardStatus: "notEligible" | "eligible" | "claimed" | "rejected";
  totalValidDwellSeconds: number;
  lastActiveStationId?: string | null;
  activeSessionId?: string | null;
  updatedAt?: unknown;
};

