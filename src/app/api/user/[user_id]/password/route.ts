import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const { user_id } = await params;
    const userId = Number(user_id);    

    if (isNaN(userId)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });

    const body = await req.json();  
    const { cur_password, new_password } = body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) {
        console.error("User not found:", userId);
        return NextResponse.json(
          { 
              success: false,
              message: "Invalid userId" }, 
              { status: 401 }
          );
    }
    
    // Check password
    const isMatch = await bcrypt.compare(cur_password, user.password);
    if (!isMatch) {
        console.error("Password mismatch for user:", user.email);
        return NextResponse.json(
          { 
              success: false,
              message: "Invalid current password" }, 
              { status: 401 }
          );
    }    
    
    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    // 🔹 Update the user's password in the database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedUserPassword = await prisma.user.update({
        where: { user_id: userId },
        data: { password: hashedNewPassword },
      });
            
    return NextResponse.json({ 
      success: true,
      message: "Password updated successfully" }, 
      { status: 200 });
          
  } catch (error) {
    return handleApiError(error);
  }
}