
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { classSubjectDto } from "@/dto/class-subject.dto";

/**
 * GET: Fetch a single ClassSubject by ID
 */

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = await params;      
      const classSubjectId = Number(id);
      if (isNaN(classSubjectId)) {
          return NextResponse.json(
              { success: false, message: "Invalid ClassSubject Id!" },
              { status: 400 });
      }

      // Build query filters
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {
        id: classSubjectId,
      };

      const classSubject = await prisma.classSubject.findUnique({
        where: whereClause,
        include: {
          students: true, // Include related students
          schedules: true, // Include related schedules
        },   
      });      

      if (!classSubject) {
        return NextResponse.json(
          { success: false, message: "Class subject not found!" }, 
          { status: 404 });
      }
  
      return NextResponse.json(
        { success: true, message: "Class subject found!", data: classSubject}, 
        { status: 200 });
      
    } catch (error) {      
      console.error("GET Error: fetching Class Subject by Id", error)
      return handleApiError(error);
    }
  }

  export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;

      // Validate ID
      const classSubjectId = Number(id);

      if (Number.isNaN(classSubjectId)) {
          return NextResponse.json(
              { success: false, message: "Invalid ClassSubject Id!" },
              { status: 400 });
      }  
      
      const body = await req.json();
      const validatedData = classSubjectDto.parse(body);

      if (!validatedData.name || !validatedData.teacher_user_id) {
        return NextResponse.json({ 
          success: false,
          message: "Missing required fields",
          data: validatedData }, 
          { status: 400 });
      }
      
      // Build query filters
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {
        id: classSubjectId,
      };

      const updatedClassSubject = await prisma.classSubject.update({
        where: whereClause,
        data: validatedData,
      });
  
      return NextResponse.json({ 
            success: true, 
            message: "Class subject has been successfuly updated!" , 
            data: updatedClassSubject }, 
            { status: 200 });
            
    } catch (error) {
      console.error("Class Subject PUT Error", error)
      return handleApiError(error);      
    }
  }

  export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const {id} = await params;
      const classSubjectId = Number(id);      
  
      if (isNaN(classSubjectId)) {
          return NextResponse.json({ message: "Invalid Class Subject Id" }, { status: 400 });
      }
        
  
      const body = await req.json();    
      // ✅ Validate input using DTO
      const {status} = body;
  
      // Build query filters
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {
          id: classSubjectId,          
      };
      
      // 🔹 Update the user's password in the database
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedClassSchedule = await prisma.classSubject.update({
          where: whereClause,
          data: { status: status },
        });
              
      return NextResponse.json({
          success: true,
          message: `Class Subject Status "${status}" updated successfully!`,
          data: updatedClassSchedule}, 
          { status: 200 });
      
    } catch (error) {
      return handleApiError(error);
    }
  }