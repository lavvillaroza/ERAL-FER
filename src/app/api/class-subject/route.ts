import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
/**
 * GET: Fetch all class subjects
 */
export async function GET() {
  try {
    const subjects = await prisma.classSubject.findMany({
      include: {
        students: true, // Include related students
        schedules: true, // Include related schedules
      },
    });

    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return handleApiError(error);
  }
}

/**
 * POST: Create a new class subject
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, date_schedule, time_schedule, teacher_user_id, status } = body;

    if (!name || !teacher_user_id) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newSubject = await prisma.classSubject.create({
      data: {
        name,
        description,
        date_schedule,
        time_schedule,
        teacher_user_id,
        status,
      },
    });

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return handleApiError(error);
  }
}

