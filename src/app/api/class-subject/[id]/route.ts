
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
/**
 * GET: Fetch a single ClassSubject by ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
    try {
      const { id } = await params;
      const classSubject = await prisma.classSubject.findUnique({
        where: { id: Number(id) },        
      });      
      if (!classSubject) {
        return NextResponse.json({ message: "ClassStudents not found" }, { status: 404 });
      }
  
      return NextResponse.json(classSubject, { status: 200 });
      
    } catch (error) {      
      return handleApiError(error);
    }
  }