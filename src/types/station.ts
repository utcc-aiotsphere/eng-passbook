export type Station = {
  stationId: string;
  eventId: string;
  name: string;
  description: string;
  locationLabel: string;
  stationNumber: number;
  icon: string;
  color: string;
  qrUrl?: string;
  isRequired: boolean;
  isActive: boolean;
  estimatedDurationMinutes: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type StationSecret = {
  stationId: string;
  qrToken: string;
  rotatedAt?: unknown;
};

