import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";


/**
 * GET: Fetch all class attendance with related ClassSchedule & ClassSubject
 */
export async function GET() {
  try {
    const attendance = await prisma.classAttendance.findMany({
      include: {
        schedule: {
          include: {
            subject: true, // Include ClassSubject from schedule
          },
        },
      },
    });

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return handleApiError(error);
  }
}

/**
 * POST: Add attendance for a student
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { class_subject_id, class_schedule_id, student_id, time_in, time_out, status } = body;

    if (!class_subject_id || !class_schedule_id || !student_id || !time_in || !time_out || !status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newAttendance = await prisma.classAttendance.create({
      data: {
        class_subject_id,
        class_schedule_id,
        student_id,
        time_in: new Date(time_in),
        time_out: new Date(time_out),
        status,
      },
      include: {
        schedule: {
          include: {
            subject: true,
          },
        },
      },
    });

    return NextResponse.json(newAttendance, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return handleApiError(error);
  }
}
