import { NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
/**
 * GET: Fetch all class subjects
 */
export async function GET() {
  try {    
    
    const classSubjects = await prisma.classSubject.findMany();
    return NextResponse.json({
      success: true,
      message: "Class Subjects fetched successfully!",
      data: classSubjects},
      { status: 200 });  
  } catch (error) {    
    return handleApiError(error);
  }
}