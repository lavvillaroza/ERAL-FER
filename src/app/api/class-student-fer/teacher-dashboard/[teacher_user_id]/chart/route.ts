import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiError } from "@/app/utils/errorHandler";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest, { params }: { params: { teacher_user_id: string } }) {
  try {
    const {teacher_user_id} = await params;
    const teacherUserId = Number(teacher_user_id);    

    if (isNaN(teacherUserId)) {
        return NextResponse.json({ message: "Invalid Teacher User Id" }, { status: 400 });
    }  
    
    const result = await prisma.$queryRaw`
      WITH AggregatedData AS (
        SELECT 
          B.teacher_user_id,
          COUNT(CASE WHEN A.dominant_fer = 'surprised' THEN 1 END) AS surprised_count,
          COUNT(CASE WHEN A.dominant_fer = 'happy' THEN 1 END) AS happy_count,
          COUNT(CASE WHEN A.dominant_fer = 'neutral' THEN 1 END) AS neutral_count,
          COUNT(CASE WHEN A.dominant_fer = 'sad' THEN 1 END) AS sad_count,
          COUNT(CASE WHEN A.dominant_fer = 'angry' THEN 1 END) AS angry_count,
          COUNT(CASE WHEN A.dominant_fer = 'disgusted' THEN 1 END) AS disgusted_count,
          COUNT(CASE WHEN A.dominant_fer = 'fearful' THEN 1 END) AS fearful_count,     
          COUNT(CASE WHEN A.dominant_fer = 'na' THEN 1 END) AS na_count,
          COUNT(*) AS total_count -- Total number of records per minute
        FROM ClassStudentsFER A
        LEFT JOIN ClassSubject B ON B.id = A.class_subject_id
        WHERE B.teacher_user_id = ${teacherUserId}
        GROUP BY B.teacher_user_id
        )
        SELECT 
        ROUND((surprised_count / total_count) * 100, 2) AS surprised,
        ROUND((happy_count / total_count) * 100, 2) AS happy,
        ROUND((neutral_count / total_count) * 100, 2) AS neutral,
        ROUND((sad_count / total_count) * 100, 2) AS sad,
        ROUND((angry_count / total_count) * 100, 2) AS angry,
        ROUND((disgusted_count / total_count) * 100, 2) AS disgusted,
        ROUND((fearful_count / total_count) * 100, 2) AS fearful,
        ROUND((na_count / total_count) * 100, 2) AS na
        FROM AggregatedData
        WHERE total_count > 0;   
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
