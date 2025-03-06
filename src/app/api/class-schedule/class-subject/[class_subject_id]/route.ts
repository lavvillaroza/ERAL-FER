import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { classScheduleDto } from "@/dto/class-schedule.dto";

// 📌 GET: Fetch a single user by ID
export async function GET(req: NextRequest, { params }: { params: { class_subject_id: string } }) {
  try {    
    
    const { class_subject_id } = await params;
    const classSubjectId = parseInt(class_subject_id);
    
    if (isNaN(classSubjectId)) {
      return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }

    const subject = await prisma.classSchedule.findMany({
      where: { class_subject_id: classSubjectId },
      include: { 
        subject: true,
        lesson_plan: true,
        attendance: true,
        student_fer: true,
    }, // Include UserDetails
    });

    console.log(subject);

    if (!subject) {
      return NextResponse.json({ message: "Class Students not found" }, { status: 404 });
    }

    return NextResponse.json(subject, { status: 200 });

  } catch (error) {    
    return handleApiError({ error: "Error fetching class Students by Class Subject Id: " + error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);

    const validatedData = classScheduleDto.parse(body);

    if (!validatedData) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newSchedule = await prisma.classSchedule.create({
      data: {
        class_subject_id: validatedData.class_subject_id,
        date_schedule: validatedData.date_schedule,
        time_start: validatedData.time_start,
        time_end: validatedData.time_end,
        status: validatedData.status,
        remarks: validatedData.remarks,
      },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return handleApiError(error);
  }
}