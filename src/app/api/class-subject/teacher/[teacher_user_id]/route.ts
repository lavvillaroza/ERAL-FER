
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
/**
 * GET: Fetch a single ClassSubject by ID
 */
export async function GET(req: NextRequest, { params }: { params: { teacher_user_id: number } }) {
    try {
      const { teacher_user_id } = params;
      
      const classSubject = await prisma.classSubject.findMany({
        where: { teacher_user_id: Number(teacher_user_id) },
        include: {
          students: true, // Include related students
          schedules: true, // Include related schedules
        },
      });
  
      if (!classSubject) {
        return NextResponse.json({ message: "ClassSubject not found" }, { status: 404 });
      }
  
      return NextResponse.json(classSubject, { status: 200 });
    } catch (error) {
      console.error("GET by ID Error:", error);
      return handleApiError(error);
    }
  }