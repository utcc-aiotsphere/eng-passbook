export function secondsBetween(startMs: number, endMs: number) {
  return Math.max(0, Math.floor((endMs - startMs) / 1000));
}

export function calculateValidDwellTime({
  checkInMs,
  checkOutMs,
  maxDwellMinutes,
}: {
  checkInMs: number;
  checkOutMs: number;
  maxDwellMinutes: number;
}) {
  const rawSeconds = secondsBetween(checkInMs, checkOutMs);
  const capSeconds = Math.max(1, maxDwellMinutes) * 60;
  const validDurationSeconds = Math.min(rawSeconds, capSeconds);
  return {
    durationSeconds: rawSeconds,
    validDurationSeconds,
    status: rawSeconds > capSeconds ? "capped" : "completed",
  } as const;
}

export function formatDuration(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    return `${hours}ชม. ${mins % 60}น.`;
  }
  return `${mins}น. ${secs}วิ.`;
}

