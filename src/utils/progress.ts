import type { EventDoc, Participant } from "@/types/event";
import type { Station } from "@/types/station";

export function getRequiredStationIds(event: EventDoc, stations: Station[]) {
  if (event.requiredStationMode === "selected") return event.requiredStationIds;
  return stations.filter((station) => station.isRequired).map((station) => station.stationId);
}

export function calculateProgress(event: EventDoc, stations: Station[], completedStationIds: string[]) {
  const requiredIds = getRequiredStationIds(event, stations);
  const completedRequired = requiredIds.filter((id) => completedStationIds.includes(id));
  const totalRequiredCount = requiredIds.length;
  const requiredCompletedCount = completedRequired.length;
  const progressPercent = totalRequiredCount === 0 ? 100 : Math.round((requiredCompletedCount / totalRequiredCount) * 100);
  return {
    requiredCompletedCount,
    totalRequiredCount,
    progressPercent,
    completed: totalRequiredCount > 0 && requiredCompletedCount >= totalRequiredCount,
  };
}

export function shouldUnlockBadge(participant: Participant, event: EventDoc) {
  return event.badgeEnabled && participant.progressPercent >= 100 && !participant.badgeUnlocked;
}

