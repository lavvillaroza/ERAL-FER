/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";

// Regex for 12-hour format (HH:MMAM / HH:MMPM)
const timeFormat12Hr = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

export const classScheduleCourseContentDto = z.object({
  id: z.number().optional(),  
  class_schedule_id: z.number().min(1, "Class Schedule ID is required"),  
  time_start: z.string().regex(timeFormat12Hr, "Invalid time format (HH:MM AM or HH:MM PM)"),    
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  status: z.enum(["upcoming", "ongoing", "finished"]),  
});

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
