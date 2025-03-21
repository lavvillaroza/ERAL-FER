import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { ClassStudentModel } from "@/models/classStudentModel";

/**
 * GET: Fetch all class students by class_subject_id
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {    
    try {
        const { id } = await params;
        const classSubjectId = Number(id);

        if (isNaN(classSubjectId)) {
            return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
        }

        // Build query filters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereClause: any = {
            class_subject_id: classSubjectId,
        };

        const classStudents = await prisma.classStudents.findMany({
            where: whereClause,
            include: {
                subject: true, // Include related ClassSubject
                student_details: true,
            }});        
        return NextResponse.json({
            success: true,
            meessage: "Class Students fetched successfully!",
            data: classStudents},
            { status: 200 });

    } catch (error) {        
        console.error("Class Students with ClassSubjectId GET Error:", error)
        return handleApiError(error);
    }
  }
  
/**
 * POST: Add a student to a class subject
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = await params;
      const classSubjectId = Number(id);
      if (isNaN(classSubjectId)) {
        return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
      }

      const body: ClassStudentModel[] = await req.json();      
      if (!Array.isArray(body) || body.length === 0) {
        return NextResponse.json({ message: "Invalid or empty student list" }, { status: 400 });
      }

      await prisma.classStudents.deleteMany({
        where: {class_subject_id: classSubjectId}                  
      });  

      const newStudents = await prisma.classStudents.createMany({
        data: body.map(({ class_subject_id, student_id }) => ({
          class_subject_id,
          student_id,
        })),
      });
            
      return NextResponse.json({
        success: true,
        message: "Students added successfully",
        data: { count: newStudents.count },
      }, { status: 201 });
      
    } catch (error) {
      console.error("POST Error:", error);
      return handleApiError(error);
    }
  }