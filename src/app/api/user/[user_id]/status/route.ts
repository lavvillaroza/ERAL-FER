import { NextRequest, NextResponse } from "next/server";
import { UpdateUserAccountStatusDto } from "@/dto/user.dto";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const { user_id } = await params;
    const userId = Number(user_id);    

    if (isNaN(userId)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });

    const body = await req.json();

    // ✅ Validate input using DTO
    const validatedData = UpdateUserAccountStatusDto.parse(body);

    const {account_status} = validatedData;
    // 🔹 Update the account status in the database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedUserAccountStatus = await prisma.user.update({
      where: { user_id: userId },
      data: { account_status },
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Account status updated successfully" }, 
      { status: 200 });
    
  } catch (error) {
    return handleApiError(error);
  }
}
