export type CheckinStatus = "active" | "completed" | "capped" | "invalidated";
export type CheckinSource = "qr" | "manual" | "admin";

export type Checkin = {
  checkinId: string;
  userId: string;
  stationId: string;
  token?: string;
  checkInAt: unknown;
  checkOutAt?: unknown;
  durationSeconds?: number;
  validDurationSeconds?: number;
  status: CheckinStatus;
  source: CheckinSource;
  userAgent?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

