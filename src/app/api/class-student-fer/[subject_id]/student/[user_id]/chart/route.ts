import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiError } from "@/app/utils/errorHandler";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest, { params }: { params: { subject_id: string, student_user_id: string } }) {
  try {
    const {subject_id,  student_user_id} = await params;
    const classSubjectId = Number(subject_id);    
    const classUserId = Number(student_user_id);

    if (isNaN(classSubjectId)) {
        return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }  

    if (isNaN(classUserId)) {
        return NextResponse.json({ message: "Invalid User Id" }, { status: 400 });
    }

    const result = await prisma.$queryRaw`
      WITH AggregatedExpressions AS (
          SELECT                                 
              ROUND(AVG(surprised), 2) AS surprised,
              ROUND(AVG(happy), 2) AS happy,
              ROUND(AVG(neutral), 2) AS neutral,
              ROUND(AVG(sad), 2) AS sad,
              ROUND(AVG(angry), 2) AS angry,
              ROUND(AVG(disgusted), 2) AS disgusted,
              ROUND(AVG(fearful), 2) AS fearful
          FROM dberal.ClassStudentsFER
          WHERE class_subject_id = ${classSubjectId}          
          AND student_user_id = ${classUserId}
          GROUP BY class_subject_id, student_user_id
      )
      SELECT * FROM AggregatedExpressions
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
