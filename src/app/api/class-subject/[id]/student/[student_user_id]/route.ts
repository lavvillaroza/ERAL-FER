import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { ClassStudentModel } from "@/models/classStudentModel";

// 📌 GET: Fetch a single user by ID
export async function GET(req: NextRequest, { params }: { params: { id: string, student_user_id: string } }) {
  try {    
    
    const { id, student_user_id } = await params;
    const classSubjectId = Number(id);
    const studentUserId = Number(student_user_id);
    
    if (isNaN(classSubjectId)) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid Class Subject Id" }, 
        { status: 400 });
    }

    if (isNaN(studentUserId)) {
        return NextResponse.json({ 
          success: false,
          message: "Invalid Class Student Id" }, 
          { status: 400 });
      }

    // Build query filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
        student_id: studentUserId, 
        class_subject_id: classSubjectId,
    };

    const classStudents = await prisma.classStudents.findMany({
      where: whereClause,
      include: { 
        student_details: true, 
        subject: true}, // Include UserDetails        
    });

    if (!classStudents) {
      return NextResponse.json({ 
        success: false,
        message: "Class Students not found" }, 
        { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Class Students using id and subject id fetched successfully!",
      data: classStudents}, { status: 200 });

  } catch (error) {    
    console.error("Class Student using student_id and class_subject_id GET Error", error);
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
    try {
      
        const body: ClassStudentModel = await req.json();              
        if (!body) {
            return NextResponse.json({ 
                success: false,
                message: "Missing class student fields",
                data: body }, 
                { status: 400 });
        }
  
      const deleteStudent = await prisma.classSchedule.delete({
        where: { id: body.id }        
      });
  
      return NextResponse.json({             
        success: true,
        message: "Class Student deleted successfully",
        data: deleteStudent },
        { status: 200 });  
                    
    } catch (error) {
      console.error("Adding Schedule POST Error:", error);
      return handleApiError(error);
    }
  }