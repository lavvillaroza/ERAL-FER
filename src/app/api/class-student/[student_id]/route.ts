import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

/**
 * GET: Fetch all schedules with related ClassSubject
 */
export async function GET(req: NextRequest, { params }: { params: { student_id: string } }) {
  try {
    const {student_id} = await params;
    const classStudents = await prisma.classStudents.findMany({
        where: { student_id: Number(student_id) },     
        include: {
            subject: true, // Include related ClassSubject
          },
    });

    // Extract subjects from the returned classStudents array
    const subjects = classStudents.map(cs => cs.subject);

    return NextResponse.json(subjects, { status: 200 });

  } catch (error) {
    console.error("GET Error:", error);
    return handleApiError(error);
  }
}