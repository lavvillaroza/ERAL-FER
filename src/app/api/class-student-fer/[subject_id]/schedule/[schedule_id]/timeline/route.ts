import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { handleApiError } from "@/app/utils/errorHandler";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    
    const result = await prisma.$queryRaw`
      SELECT  
          A.minute_group,
          A.class_subject_id,
          A.class_schedule_id,
          A.highest_avg_value,
          A.dominant_expression
      FROM dberal.view_classStudentFERAggs A
      WHERE class_subject_id = ${classSubjectId}
      AND class_schedule_id =  ${classScheduleId}   
    `;

    return NextResponse.json({
        success: true,
        message: "Successfully Aggregated Minute FER data",
        data: result}, 
        { status: 200 });
    
  } catch (error) {
    console.error("Error fetching FER data:", error);
    return handleApiError(error);     
  }
  finally {
    await prisma.$disconnect(); // Close connection
  }
}

