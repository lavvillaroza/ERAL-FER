import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiError } from "@/app/utils/errorHandler";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest, { params }: { params: { subject_id: string, schedule_id: string, student_user_id: string } }) {
  try {
    const {subject_id, schedule_id, student_user_id} = await params;
    const classSubjectId = Number(subject_id);
    const classScheduleId = Number(schedule_id);
    const classUserId = Number(student_user_id);

    if (isNaN(classSubjectId)) {
        return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }  

    if (isNaN(classScheduleId)) {
        return NextResponse.json({ message: "Invalid Class Schedule Id" }, { status: 400 });
    }

    if (isNaN(classUserId)) {
        return NextResponse.json({ message: "Invalid User Id" }, { status: 400 });
    }

    const result = await prisma.$queryRaw<Array<{
          date_group: string;
          class_subject_id: number;
          class_schedule_id: number;
          surprised: number;
          happy: number;
          neutral: number;
          sad: number;
          angry: number;
          disgusted: number;
          fearful: number;
          na: number;
      }>>`
      WITH AggregatedExpressions AS (
          SELECT  
              DATE(DATE_ADD(minute_group, INTERVAL 8 HOUR)) AS date_group, -- Extract Date
              class_subject_id,
              class_schedule_id,
              student_user_id
              COALESCE(ROUND(AVG(CASE WHEN dominant_expression = 'surprised' THEN highest_avg_value END), 2), 0) AS avg_surprised,
              COALESCE(ROUND(AVG(CASE WHEN dominant_expression = 'happy' THEN highest_avg_value END), 2), 0) AS avg_happy,
              COALESCE(ROUND(AVG(CASE WHEN dominant_expression = 'neutral' THEN highest_avg_value END), 2), 0) AS avg_neutral,
              COALESCE(ROUND(AVG(CASE WHEN dominant_expression = 'sad' THEN highest_avg_value END), 2), 0) AS avg_sad,
              COALESCE(ROUND(AVG(CASE WHEN dominant_expression = 'angry' THEN highest_avg_value END), 2), 0) AS avg_angry,
              COALESCE(ROUND(AVG(CASE WHEN dominant_expression = 'disgusted' THEN highest_avg_value END), 2), 0) AS avg_disgusted,
              COALESCE(ROUND(AVG(CASE WHEN dominant_expression = 'fearful' THEN highest_avg_value END), 2), 0) AS avg_fearful,
              COALESCE(ROUND(AVG(CASE WHEN dominant_expression = 'n/a' THEN highest_avg_value END), 2), 0) AS avg_na        
          FROM dberal.view_classStudentFERAggsWithStudentUserId          
          GROUP BY date_group, class_subject_id, class_schedule_id, student_user_id
      )
      SELECT 
          date_group,
          class_subject_id,
          class_schedule_id,
          student_user_id,
          avg_surprised as surprised,
          avg_happy as happy,
          avg_neutral as neutral,
          avg_sad as sad,
          avg_angry as angry,
          avg_disgusted as disgusted,
          avg_fearful as fearful,
          avg_na as na
      FROM AggregatedExpressions
      WHERE class_subject_id = ${classSubjectId}
      AND class_schedule_id = ${classScheduleId}
      ORDER BY date_group ASC
      `;

    return NextResponse.json({
        success: true,
        message: "Successfully Aggregated Overall FER data",
        data: result}, 
        { status: 200 });
    
  } catch (error) {
    console.error("Error fetching FER data:", error);
    return handleApiError(error);     
  }
}
