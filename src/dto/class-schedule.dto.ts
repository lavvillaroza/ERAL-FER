/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";

// Regex for 12-hour format (HH:MMAM / HH:MMPM)
const timeFormat12Hr = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

export const classScheduleDto = z.object({
  id: z.number().optional(),
  class_subject_id: z.number().min(1, "Class Subject ID is required"),
  date_schedule: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  time_start: z.string().regex(timeFormat12Hr, "Invalid time format (HH:MMAM or HH:MMPM)"),
  time_end: z.string().regex(timeFormat12Hr, "Invalid time format (HH:MMAM or HH:MMPM)"),
  status: z.enum(["upcoming", "canceled", "finished"]),
  remarks: z.string().max(500, "Remarks should not exceed 500 characters").default(""),
}).refine((data) => {
  const startTime = convertTo24Hour(data.time_start);
  const endTime = convertTo24Hour(data.time_end);
  return endTime > startTime;
}, { message: "End time must be greater than start time", path: ["time_end"] });

// Function to convert 12-hour format to 24-hour format for comparison
const convertTo24Hour = (time: string) => {
  const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (!match) return 0;

  const [_, hours, minutes, period] = match;
  let hourNum = parseInt(hours, 10);

  if (period === "PM" && hourNum !== 12) hourNum += 12;
  if (period === "AM" && hourNum === 12) hourNum = 0;

  return hourNum * 60 + parseInt(minutes, 10); // Convert to total minutes for comparison
};

export type ClassScheduleModel = z.infer<typeof classScheduleDto>;
