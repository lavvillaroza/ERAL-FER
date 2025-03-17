import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { classSubjectDto } from "@/dto/class-subject.dto";
/**
 * GET: Fetch all class subjects
 */
export async function GET(req: NextRequest) {
  try {    

    // Parse query parameters from the URL
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // 'current' or 'completed'
    

    // Build query filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      status: status,
    };

    const classSubjects = await prisma.classSubject.findMany({
      where: whereClause,
      include: {
        students: true, // Include related students
        schedules: true, // Include related schedules
      },
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

/**
 * POST: Create a new class subject
 */
export async function POST(req: NextRequest) {
  try {            
    
    const body = await req.json();
    // 🛑 Validate request body

    const validatedData = classSubjectDto.parse(body);

    if (!validatedData.name || !validatedData.teacher_user_id) {
      return NextResponse.json({ 
        success: false,
        message: "Missing required fields",
        data: validatedData }, 
        { status: 400 });
    }

    const addHours = (date: Date, hours: number) => {
      return new Date(date.getTime() + hours * 60 * 60 * 1000);
    };
        
    const newSubject = await prisma.classSubject.create({
      data: {        
        name: validatedData.name,
        description: validatedData.description,
        start_date: addHours(validatedData.start_date, 8),
        end_date: addHours(validatedData.end_date, 8),
        days: validatedData.days,
        time_schedule: validatedData.time_schedule,
        teacher_user_id: validatedData.teacher_user_id,        
        status: validatedData.status,
      },
    });

    return NextResponse.json(
      {   
          success: true,
          message: "Class Subject has been successfully created!",
          data: newSubject
      },
      { status: 201 }
  );

  } catch (error) {    
    console.error("Get Class subject by Id", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error instanceof Error && Array.isArray((error as any).errors)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).errors.forEach((err: { path: any; message: any; }) => {
        console.log(err.path, err.message);
      });
    }
    return handleApiError(error);
  }
}

