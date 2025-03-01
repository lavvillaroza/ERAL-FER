import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

/**
 * GET: Fetch all schedules with related ClassSubject
 */
export async function GET() {
  try {
    const schedules = await prisma.classSchedule.findMany({
      include: {
        subject: true, // Include related ClassSubject
      },
    });

    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return handleApiError(error);
  }
}

/**
 * POST: Create a new class schedule
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { class_subject_id, date_schedule, time_start, time_end, status } = body;

    if (!class_subject_id || !date_schedule || !time_start || !time_end || !status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newSchedule = await prisma.classSchedule.create({
      data: {
        class_subject_id,
        date_schedule,
        time_start,
        time_end,
        status,
      },
      include: {
        subject: true,
      },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return handleApiError(error);
  }
}
