import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string, schedule_id: string} }) {
  try {
    const {id, schedule_id} = await params;
    const classSubjectId = Number(id);
    const classScheduleId = Number(schedule_id);    

    if (isNaN(classSubjectId)) {
      return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }  

    if (isNaN(classScheduleId)) {
        return NextResponse.json({ message: "Invalid Class Schedule Id" }, { status: 400 });
    }

    const studentsFer = await prisma.classStudentsFER.findMany({
        where: { class_subject_id: classSubjectId, 
                class_schedule_id: classScheduleId
            },
    });

    return NextResponse.json({
      success: true,
      message: "",
      data: studentsFer}, 
      { status: 200 });

  } catch (error) {
    console.error("Fetching Class StudentsFer Error:", error);
    return handleApiError(error);
  }
}

