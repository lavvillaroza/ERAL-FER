import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { ClassStudentModel } from "@/models/classStudentModel";

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
      const body: ClassStudentModel[] = await req.json();      
      
      if (!Array.isArray(body) || body.length === 0) {
        return NextResponse.json({ message: "Invalid or empty student list" }, { status: 400 });
      }

      const newStudents = await prisma.classStudents.createMany({
        data: 
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          body.map(({ id, ...student }) => student),
      });  
      return NextResponse.json(
        { message: "Students added successfully", count: newStudents.count },
        { status: 201 }
      );
      
    } catch (error) {
      console.error("POST Error:", error);
      return handleApiError(error);
    }
  }