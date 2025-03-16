import { NextRequest, NextResponse } from "next/server";
import { UpdateUserPasswordDto } from "@/dto/user.dto";
import { handleApiError } from "@/app/utils/errorHandler";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const { user_id } = await params;
    const userId = Number(user_id);    

    if (isNaN(userId)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });

    const body = await req.json();  

    // ✅ Validate input using DTO
    const validatedData = UpdateUserPasswordDto.parse(body);
    const { password } = validatedData;

    const hashedPassword = await bcrypt.hash(password, 10);
    // 🔹 Update the user's password in the database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedUserPassword = await prisma.user.update({
        where: { user_id: userId },
        data: { password: hashedPassword },
      });
            
    return NextResponse.json({ 
      success: true,
      message: "Password updated successfully" }, 
      { status: 200 });
          
  } catch (error) {
    return handleApiError(error);
  }
}