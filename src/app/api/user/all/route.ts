import { NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

// 📌 GET: Fetch all users
export async function GET() {
  try {            
    const users = await prisma.user.findMany();    
    return NextResponse.json(
      {            
        success: true,
        message: "Fetched all users successfully!",
        data: users
      },
      { status: 201 }
  );

  } catch (error) {
    return handleApiError(error);
  }
}
