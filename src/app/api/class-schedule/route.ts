import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";


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

export async function PATCH(req: NextRequest) {
  try {
    
    const body = await req.json();    
    const {id, status} = body;
    
    console.log("id:" + id);
    console.log("status:" + status);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateClassScheduleStatus = await prisma.classSchedule.update({
        where: { id },
        data: { status: status },
      });
            
    return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });
    
  } catch (error) {
    return handleApiError(error);
  }
}