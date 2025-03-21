import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { role: string } }) {
    try {
      const { role } = await params;
            
      const users = await prisma.user.findMany({
        where: { role: role, account_status: "activated" }, // Filter users by role
        include: {          
          userDetails: true,      
        },
      });            

      // Extract userDetails from each user
      const userDetails = users.map(user => user.userDetails);      

      return NextResponse.json({
          success: true,
          message: "Student users fetched successfully!",
          data: userDetails, // Return extracted userDetails
      }, { status: 200 });
        
    } catch (error) {
      return handleApiError({ error: "Error fetching users by role: " + error });
    }
  }
  