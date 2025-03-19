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
    WITH AggregatedData AS (
          SELECT 
			        DATE_FORMAT(DATE_ADD(datetime_stamp, INTERVAL 8 HOUR), '%Y-%m-%d') AS date_group, 
              class_subject_id,
              class_schedule_id,
              COUNT(CASE WHEN dominant_fer = 'surprised' THEN 1 END) AS surprised_count,
              COUNT(CASE WHEN dominant_fer = 'happy' THEN 1 END) AS happy_count,
              COUNT(CASE WHEN dominant_fer = 'neutral' THEN 1 END) AS neutral_count,
              COUNT(CASE WHEN dominant_fer = 'sad' THEN 1 END) AS sad_count,
              COUNT(CASE WHEN dominant_fer = 'angry' THEN 1 END) AS angry_count,
              COUNT(CASE WHEN dominant_fer = 'disgusted' THEN 1 END) AS disgusted_count,
              COUNT(CASE WHEN dominant_fer = 'fearful' THEN 1 END) AS fearful_count,  
              COUNT(CASE WHEN dominant_fer = 'na' THEN 1 END) AS na_count,  
              COUNT(*) AS total_count -- Total number of records per minute
          FROM ClassStudentsFER
          WHERE class_subject_id = ${classSubjectId}
            AND class_schedule_id = ${classScheduleId}          
          GROUP BY date_group, class_subject_id, class_schedule_id
      )
      SELECT 
		  date_group,
          class_subject_id,
          class_schedule_id,          
          ROUND((surprised_count / total_count) * 100, 2) AS surprised,
          ROUND((happy_count / total_count) * 100, 2) AS happy,
          ROUND((neutral_count / total_count) * 100, 2) AS neutral,
          ROUND((sad_count / total_count) * 100, 2) AS sad,
          ROUND((angry_count / total_count) * 100, 2) AS angry,
          ROUND((disgusted_count / total_count) * 100, 2) AS disgusted,
          ROUND((fearful_count / total_count) * 100, 2) AS fearful,
          ROUND((na_count / total_count) * 100, 2) AS na
      FROM AggregatedData
      WHERE total_count > 0
      ORDER BY class_subject_id, class_schedule_id                  
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
