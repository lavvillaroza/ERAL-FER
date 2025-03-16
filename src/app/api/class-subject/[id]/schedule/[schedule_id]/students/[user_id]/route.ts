import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { classStudentFERDto } from "@/dto/class-students-fer.dto";

/**
 * GET: Fetch schedule using subject id and schedule id
 */
export async function GET(req: NextRequest, { params }: { params: { id: string, schedule_id: string, user_id: string } }) {
  try {
    const {id, schedule_id, user_id} = await params;
    const classSubjectId = Number(id);
    const classScheduleId = Number(schedule_id);
    const classUserId = Number(user_id);

    if (isNaN(classSubjectId)) {
      return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }  

    if (isNaN(classScheduleId)) {
        return NextResponse.json({ message: "Invalid Class Schedule Id" }, { status: 400 });
    }

    if (isNaN(classUserId)) {
        return NextResponse.json({ message: "Invalid User Id" }, { status: 400 });
    }

    const studentsFer = await prisma.classStudentsFER.findMany({
        where: { class_subject_id: classSubjectId, 
                class_schedule_id: classScheduleId, 
                student_user_id: classUserId },
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

export async function POST(req: NextRequest, { params }: { params: { id: string, schedule_id: string, user_id: string } }) {
  try {
    const {id, schedule_id, user_id} = await params;
    const classSubjectId = Number(id);
    const classScheduleId = Number(schedule_id);
    const classUserId = Number(user_id);

    if (isNaN(classSubjectId)) {
      return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }  

    if (isNaN(classScheduleId)) {
        return NextResponse.json({ message: "Invalid Class Schedule Id" }, { status: 400 });
    }

    if (isNaN(classUserId)) {
        return NextResponse.json({ message: "Invalid User Id" }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = classStudentFERDto.parse(body);

    console.log(validatedData);

    const studentsFer = await prisma.classStudentsFER.create({
        data: {          
            class_subject_id: classSubjectId,
            class_schedule_id: classScheduleId,
            student_user_id: classUserId,
            surprised: validatedData.surprised,
            happy: validatedData.happy,
            neutral: validatedData.neutral,
            sad: validatedData.sad,
            angry: validatedData.angry,
            disgusted: validatedData.disgusted,
            fearful: validatedData.fearful,            
            datetime_stamp: validatedData.datetime_stamp            
        }
    });

    return NextResponse.json({
      success: true,
      message: "Student FER created successfully!",
      data: studentsFer}, 
      { status: 200 });

  } catch (error) {
    console.error("Creating Students FER Error:", error);
    return handleApiError(error);
  }
}
