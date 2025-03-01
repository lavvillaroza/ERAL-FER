import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";


/**
 * GET: Fetch user details by user_id
 */
export async function GET(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const user_id = parseInt(params.user_id);
    
    if (isNaN(user_id)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });

    const userDetails = await prisma.userDetails.findUnique({
      where: { user_id },
    });

    if (!userDetails) return NextResponse.json({ message: "User details not found" }, { status: 404 });

    return NextResponse.json(userDetails, { status: 200 });
  } catch (error) {
    console.error("GET User Details Error:", error);
    return handleApiError(error);
  }
}