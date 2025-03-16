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

    const result = await prisma.$queryRaw`
      SELECT  
          A.minute_group,
          A.class_subject_id,
          A.class_schedule_id,
          A.student_user_id,
          A.highest_avg_value,
          A.dominant_expression
      FROM dberal.view_classStudentFERAggsWithStudentUserId A
      WHERE class_subject_id = ${classSubjectId}
      AND class_schedule_id =  ${classScheduleId}   
      AND student_user_id =  ${classUserId}
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
