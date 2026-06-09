import { z } from "zod";

export const badgeSchema = z.object({
  badgeTitle: z.string().min(1),
  subtitle: z.string().optional(),
  badgeLevel: z.enum(["Explorer", "Innovator", "Builder", "AIoT Champion"]),
  badgeIcon: z.string().min(1),
  colorTheme: z.enum(["cyan", "violet", "magenta", "amber"]),
});

