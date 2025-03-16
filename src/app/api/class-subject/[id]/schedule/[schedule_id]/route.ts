import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { classScheduleDto } from "@/dto/class-schedule.dto";

/**
 * GET: Fetch schedule using subject id and schedule id
 */
export async function GET(req: NextRequest, { params }: { params: { id: string, schedule_id: string } }) {
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

    const schedule = await prisma.classSchedule.findUnique({
        where: { id: classScheduleId, class_subject_id: classSubjectId },      
        include: { course_contents: true }
    });

    console.log("Class Schedule:", schedule);

    return NextResponse.json({
      success: true,
      message: "",
      data: schedule}, 
      { status: 200 });

  } catch (error) {
    console.error("Fetching Class Schedule Error:", error);
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string, schedule_id: string } }) {
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

    const body = await req.json();
    const validatedData = classScheduleDto.parse(body);

    const schedule = await prisma.classSchedule.update({
        where: { id: classScheduleId, class_subject_id: classSubjectId },
        data: validatedData      
    });

    return NextResponse.json({
      success: true,
      message: "Class Schedule updated successfully!",
      data: schedule}, 
      { status: 200 });

  } catch (error) {
    console.error("Fetching Class Schedule Error:", error);
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string, schedule_id: string } }) {
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

    const body = await req.json();    
    // ✅ Validate input using DTO
    const {status} = body;

    // Build query filters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
        id: classScheduleId,
        class_subject_id: classSubjectId,
    };
    
    // 🔹 Update the user's password in the database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedClassSchedule = await prisma.classSchedule.update({
        where: whereClause,
        data: { status: status },
      });
            
    return NextResponse.json({
        success: true,
        message: "Class Schedule Status updated successfully!",
        data: updatedClassSchedule}, 
        { status: 200 });
    
  } catch (error) {
    return handleApiError(error);
  }
}