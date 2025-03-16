import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

/**
 * GET: Fetch all class subjects
 */
export async function GET(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {    

    // Parse query parameters from the URL
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // 'current' or 'completed'
    const { user_id } = await params;


    // Validate ID
    const teacherUserId = Number(user_id);
    if (Number.isNaN(teacherUserId)) {
        return NextResponse.json(
            { success: false, message: "Invalid Teacher User Id!" },
            { status: 400 });
    }

    // Build query filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      status: status,
      teacher_user_id: teacherUserId,
    };

    const classSubjects = await prisma.classSubject.findMany({
      where: whereClause,
      include: {
        students: true, // Include related students
        schedules: true, // Include related schedules
      },
    });

    return NextResponse.json({
      success: true,
      message: "Class Subjects fetched successfully!",
      data: classSubjects},
      { status: 200 });      
  } catch (error) {    
    return handleApiError(error);
  }
}

