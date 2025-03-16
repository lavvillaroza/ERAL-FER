import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/app/utils/errorHandler";
import { classScheduleCourseContentDto } from "@/dto/class-schedule-course-content.dto";

export async function GET(req: NextRequest, { params }: { params: { id: string, schedule_id: string } }) {
    try {
      const { id, schedule_id } = await params;      
      const classSubjectId = Number(id);

      console.log("Id:", id);
      console.log("schedule_id:", schedule_id);
      
      if (isNaN(classSubjectId)) {
          return NextResponse.json(
              { success: false, message: "Invalid ClassSubject Id!" },
              { status: 400 });
      }

      const classScheduleId = Number(schedule_id);
      if (isNaN(classScheduleId)) {
          return NextResponse.json(
              { success: false, message: "Invalid classSchedule Id!" },
              { status: 400 });
      }

      // Build query filters
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {        
        class_subject_id: schedule_id,        
      };

      const classCourseContents = await prisma.classCourseContent.findMany({
        where: whereClause,       
      });      

      if (!classCourseContents) {
        return NextResponse.json(
          { success: false, message: "Class Schedule course contents not found!" }, 
          { status: 404 });
      }
  
      return NextResponse.json(
        { success: true, message: "Class Schedule course contents found!", data: classCourseContents}, 
        { status: 200 });
      
    } catch (error) {      
      console.error("GET Error: fetching Class Schedule course contents by SubjectId and ScheduleId", error)
      return handleApiError(error);
    }
  }

  export async function PUT(req: NextRequest, { params }: { params: { id: string, schedule_id: string } }) {
      try {
        const { id, schedule_id } = await params;      
        const classSubjectId = Number(id);
        
        if (isNaN(classSubjectId)) {
            return NextResponse.json(
                { success: false, message: "Invalid ClassSubject Id!" },
                { status: 400 });
        }

        const classScheduleId = Number(schedule_id);
        if (isNaN(classScheduleId)) {
            return NextResponse.json(
                { success: false, message: "Invalid classSchedule Id!" },
                { status: 400 });
        }

        const body = await req.json();
        const validatedData = classScheduleCourseContentDto.parse(body);        
                
        const createClassScheduleCourseContents = await prisma.classCourseContent.createMany({          
          data: [ validatedData ],
        });
    
        return NextResponse.json({ 
              success: true, 
              message: "Class Schedule Course Contents has been successfuly updated!" , 
              data: createClassScheduleCourseContents }, 
              { status: 200 });
              
      } catch (error) {
        console.error("Class Schedule Course Contents PUT Error", error)
        return handleApiError(error);      
      }
    }