import { NextRequest, NextResponse } from "next/server";
import { UpdateUserPasswordDto } from "@/dto/user.dto";
import { handleApiError } from "@/app/utils/errorHandler";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();    
    // ✅ Validate input using DTO
    const validatedData = UpdateUserPasswordDto.parse(body);
    const {user_id, password} = validatedData;

    const hashedPassword = await bcrypt.hash(password, 10);
    // 🔹 Update the user's password in the database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedUserPassword = await prisma.user.update({
        where: { user_id },
        data: { password: hashedPassword },
      });
            
    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    
  } catch (error) {
    return handleApiError(error);
  }
}