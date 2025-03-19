import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import { UserTeacherThresholdModel } from "@/models/userTeacherThresholdModel";

// 📌 GET: Fetch a single user by ID
export async function GET(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {    
    
    const {user_id} = await params;
    
    const userId = parseInt(user_id);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const userTeacherThresholds = await prisma.userTeacherThreshold.findMany({
      where: { user_id: userId } // Include UserDetails
    });

    if (!userTeacherThresholds) {
      throw new Error("UserTeacherThreshold not found!")
    }

    return NextResponse.json({
      success: true,
      message: "UserTeacherThreshold fetched successfully",
      data: userTeacherThresholds}, 
      { status: 200 });

  } catch (error) {    
    return handleApiError({ error: "Error fetching userTeacherThreshold by ID: " + error });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { user_id: string } }) {
    try {
      const { user_id } = await params;
      // Validate ID
      const userId = Number(user_id);

      if (Number.isNaN(userId)) {
          return NextResponse.json(
              { success: false, message: "Invalid User Id!" },
              { status: 400 });
      }    

      const userThreshold: UserTeacherThresholdModel = await req.json();          
      if (!userThreshold) {
          return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }      
      
      const updateUserThreshold = await prisma.userTeacherThreshold.update({
          where: {id: userThreshold.id},
          data: {
            message: userThreshold.message,
            threshold: userThreshold.threshold,
          }
      })
      
      console.log("updateUserThreshold:", updateUserThreshold)
      return NextResponse.json({ 
        success: true,
        message: "UserTeacherThreshold updated successfully", 
        data: updateUserThreshold },       
        { status: 200 });

  } catch (error) {
    return handleApiError(error);
  }
}
