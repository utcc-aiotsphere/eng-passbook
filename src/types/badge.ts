import type { BadgeLevel, BadgeTemplateConfig } from "./event";

export type UserBadge = {
  badgeId: string;
  eventId: string;
  userId: string;
  displayName: string;
  eventName: string;
  badgeTitle: string;
  badgeLevel: BadgeLevel;
  issuedAt: unknown;
  verificationCode: string;
  badgeConfigSnapshot: BadgeTemplateConfig;
  status: "active" | "revoked";
};

