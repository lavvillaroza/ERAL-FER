import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

/**
 * GET: Fetch all schedules with related ClassSubject
 */
export async function GET(req: NextRequest, { params }: { params: { class_schedule_id: string } }) {
  try {
    const {class_schedule_id} = await params;
    const id = parseInt(class_schedule_id);

    const schedules = await prisma.classSchedule.findUnique({
        where: { id: id },      
    });

    return NextResponse.json(schedules, { status: 200 });

  } catch (error) {
    console.error("GET Error:", error);
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
    try {
      
      const body = await req.json();    
      const {id, status} = body;
  
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updateClassScheduleStatus = await prisma.classSchedule.update({
          where: { id },
          data: { status: status },
        });
              
      return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
      
    } catch (error) {
      return handleApiError(error);
    }
  }