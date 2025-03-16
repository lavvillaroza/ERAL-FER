import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { classScheduleDto } from "@/dto/class-schedule.dto";

// 📌 GET: Fetch a single user by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {    
    const { id } = await params;
    const classSubjectId = Number(id);

    if (isNaN(classSubjectId)) {
      return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }

    // Build query filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
    class_subject_id: classSubjectId,
    };

    const schedule = await prisma.classSchedule.findMany({
      where: whereClause,
          //   include: { 
          //     subject: true,
          //     course_contents: true,
          //     attendance: true,
          //     student_fer: true,
          // }, // Include UserDetails
    });

    if (!schedule) {
      return NextResponse.json({             
            success: false,
            message: "No Class Schedule found!",
            data: [] },
            { status: 404 });
    }

    return NextResponse.json({             
      success: true,
      message: "Class Schedules fetched successfully!",
      data: schedule },
      { status: 200 });    

  } catch (error) {    
    console.error("Class Schedules GET Error:", error)
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    
    const body = await req.json();    
    const validatedData = classScheduleDto.parse(body);

    if (!validatedData) {
      return NextResponse.json({ 
        success: false,
        message: "Missing required fields",
        data: validatedData }, 
        { status: 400 });
    }

    const newSchedule = await prisma.classSchedule.create({
      data: {
        class_subject_id: validatedData.class_subject_id,
        date_schedule: validatedData.date_schedule,
        time_start: validatedData.time_start,
        time_end: validatedData.time_end,
        status: validatedData.status,
        topic_title: validatedData.topic_title,
        remarks: validatedData.remarks,
      },
    });

    return NextResponse.json({             
      success: true,
      message: "New schedule added successfully",
      data: newSchedule },
      { status: 200 });  
          
  } catch (error) {
    console.error("Adding Schedule POST Error:", error);
    return handleApiError(error);
  }
}