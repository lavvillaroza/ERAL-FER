import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { classSubjectDto } from "@/dto/class-subject.dto";
/**
 * GET: Fetch all class subjects
 */
export async function GET() {
  try {
    const subjects = await prisma.classSubject.findMany({
      include: {
        students: true, // Include related students
        schedules: true, // Include related schedules
      },
    });

    return NextResponse.json(subjects, { status: 200 });

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

    console.log("ValidatedData:");
    console.log(validatedData);

    if (!validatedData.name || !validatedData.teacher_user_id) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
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
          message: "Class Subject has been successfully created!",
          data: newSubject
      },
      { status: 201 }
  );

  } catch (error) {    
    return handleApiError(error);
  }
}

