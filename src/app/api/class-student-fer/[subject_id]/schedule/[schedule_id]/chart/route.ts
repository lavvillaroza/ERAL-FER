import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiError } from "@/app/utils/errorHandler";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { subject_id: string, schedule_id: string} }) {
  try {
    const { subject_id, schedule_id } = await params;
    const classSubjectId = Number(subject_id);
    const classScheduleId = Number(schedule_id);    

    if (isNaN(classSubjectId)) {
        return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }  

    if (isNaN(classScheduleId)) {
        return NextResponse.json({ message: "Invalid Class Schedule Id" }, { status: 400 });
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
              DATE_FORMAT(DATE_ADD(datetime_stamp, INTERVAL 8 HOUR), '%Y-%m-%d') AS date_group, 
              class_subject_id,
              class_schedule_id,
              ROUND(AVG(surprised), 2) AS avg_surprised,
              ROUND(AVG(happy), 2) AS avg_happy,
              ROUND(AVG(neutral), 2) AS avg_neutral,
              ROUND(AVG(sad), 2) AS avg_sad,
              ROUND(AVG(angry), 2) AS avg_angry,
              ROUND(AVG(disgusted), 2) AS avg_disgusted,
              ROUND(AVG(fearful), 2) AS avg_fearful
          FROM dberal.ClassStudentsFER    
          WHERE class_subject_id = ${classSubjectId}
            AND class_schedule_id = ${classScheduleId}      
          GROUP BY date_group, class_subject_id, class_schedule_id
      )
      SELECT 
          date_group,
          class_subject_id,
          class_schedule_id,
          avg_surprised as surprised,
          avg_happy as happy,
          avg_neutral as neutral,
          avg_sad as sad,
          avg_angry as angry,
          avg_disgusted as disgusted,
          avg_fearful as fearful,
          CASE 
              WHEN ROUND(avg_surprised + avg_happy + avg_neutral + avg_sad + 
                    avg_angry + avg_disgusted + avg_fearful, 2) = 0 THEN 1 
              ELSE 0
          END AS na
      FROM AggregatedExpressions                  
      `;    
    const fixedResult = result.map(row => ({
        ...row,
        surprised: Number(row.surprised),
        happy: Number(row.happy),
        neutral: Number(row.neutral),
        sad: Number(row.sad),
        angry: Number(row.angry),
        disgusted: Number(row.disgusted),
        fearful: Number(row.fearful),
        na: Number(row.na)
    }));
    console.log(fixedResult);
    return NextResponse.json({
        success: true,
        message: "Successfully Aggregated Overall FER data",
        data: fixedResult[0] || null}, 
        { status: 200 });
    
  } catch (error) {
    console.error("Error fetching FER data:", error);
    return handleApiError(error);     
  }
  finally {
    await prisma.$disconnect(); // Close connection
  }
}
