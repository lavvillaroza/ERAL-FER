import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiError } from "@/app/utils/errorHandler";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest, { params }: { params: { subject_id: string } }) {
  try {
    const {subject_id} = await params;
    const classSubjectId = Number(subject_id);        

    if (isNaN(classSubjectId)) {
        return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }      

    const result = await prisma.$queryRaw`
        WITH AggregatedData AS (
          SELECT 
              class_subject_id,
              class_schedule_id,                            
              COUNT(CASE WHEN dominant_fer = 'surprised' THEN 1 END) AS surprised_count,
              COUNT(CASE WHEN dominant_fer = 'happy' THEN 1 END) AS happy_count,
              COUNT(CASE WHEN dominant_fer = 'neutral' THEN 1 END) AS neutral_count,
              COUNT(CASE WHEN dominant_fer = 'sad' THEN 1 END) AS sad_count,
              COUNT(CASE WHEN dominant_fer = 'angry' THEN 1 END) AS angry_count,
              COUNT(CASE WHEN dominant_fer = 'disgusted' THEN 1 END) AS disgusted_count,
              COUNT(CASE WHEN dominant_fer = 'fearful' THEN 1 END) AS fearful_count,              
              COUNT(*) AS total_count -- Total number of records per minute
          FROM ClassStudentsFER
          WHERE class_subject_id = ${classSubjectId}
          GROUP BY class_subject_id, class_schedule_id, time_per_minute
      )
      SELECT 
          class_subject_id,
          class_schedule_id,                    
          ROUND((surprised_count / total_count) * 100, 2) AS surprised,
          ROUND((happy_count / total_count) * 100, 2) AS happy,
          ROUND((neutral_count / total_count) * 100, 2) AS neutral,
          ROUND((sad_count / total_count) * 100, 2) AS sad,
          ROUND((angry_count / total_count) * 100, 2) AS angry,
          ROUND((disgusted_count / total_count) * 100, 2) AS disgusted,
          ROUND((fearful_count / total_count) * 100, 2) AS fearful       
      FROM AggregatedData
      WHERE total_count > 0
      ORDER BY class_subject_id, class_schedule_id;
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
