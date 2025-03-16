import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const { user_id } = await params;
    const userId = Number(user_id);    

    if (isNaN(userId)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });

    const userDetails = await prisma.userDetails.findUnique({
      where: { user_id: userId },
    });

    if (!userDetails) {
      return NextResponse.json({ 
        success: false,
        message: "User details not found!" }, 
        { status: 404 });
    } 

    return NextResponse.json({
      success: true,
      message: "User details fetched successfully!",
      data: userDetails}, 
      { status: 200 });
      
  } catch (error) {
    console.error("GET User Details Error:", error);
    return handleApiError(error);
  }
}