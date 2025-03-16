import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/app/utils/errorHandler";

export async function PATCH(req: NextRequest, { params }: { params: { id: string, schedule_id: string } }) {
  try {
    const { id, schedule_id } = await params;
    const courseContentsId = Number(id);

    if (isNaN(courseContentsId)) {
      return NextResponse.json(
        { success: false, message: "Invalid courseContentsId!" },
        { status: 400 }
      );
    }

    const classScheduleId = Number(schedule_id);
    if (isNaN(classScheduleId)) {
      return NextResponse.json(
        { success: false, message: "Invalid classSchedule Id!" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required!" },
        { status: 400 }
      );
    }

    const updatedClassCourseContent = await prisma.classCourseContent.updateMany({
      where: {
        id: courseContentsId,
        class_schedule_id: classScheduleId,
      },
      data: {
        status,
      },
    });

    if (updatedClassCourseContent.count === 0) {
      return NextResponse.json(
        { success: false, message: "Class Schedule course contents not found or not updated!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Class Schedule course contents status updated!", data: updatedClassCourseContent },
      { status: 200 }
    );

  } catch (error) {
    console.error("PATCH Error: updating Class Schedule course contents status", error)
    return handleApiError(error);
  }
}