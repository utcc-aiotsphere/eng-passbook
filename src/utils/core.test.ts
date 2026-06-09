import { describe, expect, it } from "vitest";
import { calculateValidDwellTime } from "./time";
import { calculateProgress, shouldUnlockBadge } from "./progress";
import { canManageEvent, canViewEvent, isAdmin } from "./permissions";
import { sortLeaderboard } from "./leaderboard";
import type { EventDoc, Participant } from "@/types/event";
import type { Station } from "@/types/station";
import type { AppUser } from "@/types/user";

const event = {
  eventId: "e1",
  name: "Demo",
  slug: "demo",
  description: "",
  themePreset: "hologram",
  location: "UTCC",
  startAt: null,
  endAt: null,
  status: "active",
  createdBy: "u1",
  ownerIds: ["u1"],
  managerIds: [],
  visibility: "public",
  requiredStationMode: "all",
  requiredStationIds: [],
  maxDwellMinutesPerStation: 30,
  allowRepeatCheckin: false,
  rewardEnabled: true,
  badgeEnabled: true,
} satisfies EventDoc;

const stations = [
  { stationId: "s1", eventId: "e1", name: "A", description: "", locationLabel: "", stationNumber: 1, icon: "", color: "", isRequired: true, isActive: true, estimatedDurationMinutes: 10 },
  { stationId: "s2", eventId: "e1", name: "B", description: "", locationLabel: "", stationNumber: 2, icon: "", color: "", isRequired: true, isActive: true, estimatedDurationMinutes: 10 },
] satisfies Station[];

describe("core business logic", () => {
  it("caps dwell time", () => {
    const result = calculateValidDwellTime({ checkInMs: 0, checkOutMs: 90 * 60 * 1000, maxDwellMinutes: 30 });
    expect(result.durationSeconds).toBe(5400);
    expect(result.validDurationSeconds).toBe(1800);
    expect(result.status).toBe("capped");
  });

  it("validates completion", () => {
    expect(calculateProgress(event, stations, ["s1"]).progressPercent).toBe(50);
    expect(calculateProgress(event, stations, ["s1", "s2"]).completed).toBe(true);
  });

  it("checks permissions", () => {
    const admin = { uid: "a", globalRole: "admin", displayName: "A", email: "a@example.com" } satisfies AppUser;
    expect(isAdmin(admin)).toBe(true);
    expect(canManageEvent(admin, event)).toBe(true);
    expect(canViewEvent(null, event)).toBe(true);
  });

  it("unlocks badge only after completion", () => {
    const participant = { userId: "u", displayName: "U", email: "u@example.com", completedStationIds: ["s1", "s2"], requiredCompletedCount: 2, totalRequiredCount: 2, progressPercent: 100, badgeUnlocked: false, rewardStatus: "eligible", totalValidDwellSeconds: 0 } satisfies Participant;
    expect(shouldUnlockBadge(participant, event)).toBe(true);
  });

  it("sorts leaderboard by dwell time", () => {
    const rows = sortLeaderboard([
      { userId: "a", displayName: "A", email: "", completedStationIds: [], requiredCompletedCount: 0, totalRequiredCount: 0, progressPercent: 0, badgeUnlocked: false, rewardStatus: "notEligible", totalValidDwellSeconds: 10 },
      { userId: "b", displayName: "B", email: "", completedStationIds: [], requiredCompletedCount: 0, totalRequiredCount: 0, progressPercent: 0, badgeUnlocked: false, rewardStatus: "notEligible", totalValidDwellSeconds: 30 },
    ]);
    expect(rows[0].userId).toBe("b");
  });
});

