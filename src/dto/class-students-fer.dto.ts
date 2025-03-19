import { z } from "zod";

export const classStudentFERDto = z.object({
  id: z.number().optional(), // Assuming id is auto-generated
  classsched_id: z.number().min(1, { message: "classsched_id must be greater than zero" }),
  student_user_id: z.number().min(1, { message: "student_user_id must be greater than zero" }),
  surprised: z.number().min(0, { message: "surprised cannot be negative" }),
  happy: z.number().min(0, { message: "happy cannot be negative" }),
  neutral: z.number().min(0, { message: "neutral cannot be negative" }),
  sad: z.number().min(0, { message: "sad cannot be negative" }),
  angry: z.number().min(0, { message: "angry cannot be negative" }),
  disgusted: z.number().min(0, { message: "disgusted cannot be negative" }),
  fearful: z.number().min(0, { message: "fearful cannot be negative" }),  
  highest_value: z.number().min(0, { message: "highest_value cannot be negative" }),  
  dominant_fer: z.string().min(2,"no dominant fer provided"),
  datetime_stamp: z.union([
    z.date(),
    z.string().transform((str) => new Date(str)) // Convert string to Date
  ]),
});