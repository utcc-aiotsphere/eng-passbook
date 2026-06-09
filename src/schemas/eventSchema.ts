import { z } from "zod";

export const eventSchema = z
  .object({
    name: z.string().min(1, "กรุณากรอกชื่อกิจกรรม"),
    description: z.string().optional(),
    location: z.string().optional(),
    startAt: z.string().min(1),
    endAt: z.string().min(1),
    status: z.enum(["draft", "published", "active", "completed", "archived"]),
    visibility: z.enum(["public", "private", "inviteOnly"]),
    maxDwellMinutesPerStation: z.coerce.number().positive(),
  })
  .refine((data) => new Date(data.startAt).getTime() <= new Date(data.endAt).getTime(), {
    message: "เวลาเริ่มต้องมาก่อนเวลาสิ้นสุด",
    path: ["endAt"],
  });

