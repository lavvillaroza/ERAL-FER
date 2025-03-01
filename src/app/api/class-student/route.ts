import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

/**
 * GET: Fetch all class students with related ClassSubject
 */
export async function GET() {
    try {
      const students = await prisma.classStudents.findMany({
        include: {
          subject: true, // Include related ClassSubject
        },
      });
  
      return NextResponse.json(students, { status: 200 });
    } catch (error) {        
      return handleApiError(error);
    }
  }
  
  /**
   * POST: Add a student to a class subject
   */
  export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { class_subject_id, student_id } = body;
  
      if (!class_subject_id || !student_id) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
  
      const newStudent = await prisma.classStudents.create({
        data: {
          class_subject_id,
          student_id,
        },
        include: {
          subject: true,
        },
      });
  
      return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
      console.error("POST Error:", error);
      return handleApiError(error);
    }
  }