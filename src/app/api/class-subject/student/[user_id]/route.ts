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
    const studentUserId = Number(user_id);
    if (Number.isNaN(studentUserId)) {
        return NextResponse.json(
            { success: false, message: "Invalid Student User Id!" },
            { status: 400 });
    }

    // status provided is null    
    if (!status) {
        return NextResponse.json(
            { success: false, message: "Invalid status!" },
            { status: 400 });
    }


    const classSubjects = await prisma.classSubject.findMany({
        where: {
          status: status, // Fetch only completed classes
          students: {
            some: {
              student_id: studentUserId
            }
          }
        },
        include: {
          students: {
            include: {
              student_details: true // Include student details if needed
            }
          },
          schedules: true // Include schedules if needed
        }
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

