import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

// 📌 GET: Fetch a single user by ID
export async function GET(req: NextRequest, { params }: { params: { class_subject_id: string } }) {
  try {    
    
    const { class_subject_id } = await params;
    const classSubjectId = parseInt(class_subject_id);
    
    if (isNaN(classSubjectId)) {
      return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
    }

    const user = await prisma.classStudents.findMany({
      where: { class_subject_id: classSubjectId },
      include: { 
        student_details: true, 
        subject: true}, // Include UserDetails        
    });

    if (!user) {
      return NextResponse.json({ message: "Class Students not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {    
    return handleApiError({ error: "Error fetching class Students by Class Subject Id: " + error });
  }
}