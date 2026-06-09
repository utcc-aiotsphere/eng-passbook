import { z } from "zod";

export const userProfileSchema = z.object({
  displayName: z.string().min(1),
  studentId: z.string().optional(),
  phone: z.string().optional(),
  organization: z.string().optional(),
});

