import { z } from "zod";

export const rewardSchema = z.object({
  rewardEnabled: z.boolean(),
  rewardName: z.string().optional(),
  rewardDescription: z.string().optional(),
  rewardQuantity: z.coerce.number().positive().optional(),
  claimInstructions: z.string().optional(),
  claimLocation: z.string().optional(),
});

