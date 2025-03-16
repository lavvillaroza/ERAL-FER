import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/app/utils/errorHandler";
import { classScheduleCourseContentDto } from "@/dto/class-schedule-course-content.dto";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: { schedule_id: string } }) {
    try {

      const { schedule_id } = await params;                            
      const classScheduleId = Number(schedule_id);
      
      if (isNaN(classScheduleId)) {
          return NextResponse.json(
              { success: false, message: "Invalid classSchedule Id!" },
              { status: 400 });
      }

      // Build query filters
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {        
        class_schedule_id: classScheduleId,        
      };

      const classCourseContents = await prisma.classCourseContent.findMany({
        where: whereClause,       
      });      
        
      return NextResponse.json(
        { success: true, message: "Class Schedule course contents found!", data: classCourseContents}, 
        { status: 200 });
      
    } catch (error) {        
      console.error("Class Schedule Course Contents GET Error", error)    
      return handleApiError(error);
    }
  }

  export async function PUT(req: NextRequest, { params }: { params: { schedule_id: string } }) {
    try {      
      const { schedule_id } = await params;                            
      const classScheduleId = Number(schedule_id);
      const body = await req.json();      
      const { topic_title, classCourseContents } = body;

      const validatedData =  z.array(classScheduleCourseContentDto).parse(classCourseContents);;      

      if (isNaN(classScheduleId)) {
          return NextResponse.json(
              { success: false, message: "Invalid classSchedule Id!" },
              { status: 400 });
      }
      // Step 1: Delete existing course contents for this schedule
      const updatedClassSchedule = await prisma.classSchedule.update({
        where: {id: classScheduleId},
        data: {topic_title}
      });

      // Build query filters
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {        
        class_schedule_id: classScheduleId,        
      };

      // Step 1: Delete existing course contents for this schedule
      await prisma.classCourseContent.deleteMany({
        where: whereClause
      });

      // Step 2: Add new course contents
      const updatedClassCourseContents = await prisma.classCourseContent.createMany({
        data: validatedData.map((content) => ({          
          class_schedule_id: content.class_schedule_id,
          time_start: content.time_start,
          title: content.title,
          description: content.description,
          status: content.status
        })), // Insert the new records
      });      
  
      return NextResponse.json({
        success: true,
        message: "Class Schedule Course Contents has been successfully updated!",
        data: { updatedClassSchedule, updatedClassCourseContents }
      }, { status: 200 });
  
    } catch (error) {
      console.error("Class Schedule Course Contents PUT Error", error);
      return handleApiError(error);
    }
  }