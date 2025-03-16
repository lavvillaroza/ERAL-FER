import { z } from "zod";

export const classSubjectDto = z.object({  
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  time_schedule: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM) - (0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
  "Time must be in the format HH:MM AM - HH:MM PM"),
  days: z.string().min(1,"Please select weekdays schedule"),
  teacher_user_id: z.number().int().positive("Invalid teacher ID"),
  status: z.enum(["current", "completed"], { message: "Status must be either 'current' or 'completed'" }),
  created_date: z.coerce.date().default(() => new Date()),
  updated_date: z.coerce.date().default(() => new Date()),
})
.refine((data) => data.end_date > data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"], // Attaches error to end_date field
});