import { z } from "zod";

export const stationSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อฐาน"),
  description: z.string().optional(),
  locationLabel: z.string().optional(),
  stationNumber: z.coerce.number().positive(),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  estimatedDurationMinutes: z.coerce.number().positive(),
});

