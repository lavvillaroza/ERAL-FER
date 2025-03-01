import { NextRequest, NextResponse } from "next/server";
import { UpdateUserAccountStatusDto } from "@/dto/user.dto";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ Validate input using DTO
    const validatedData = UpdateUserAccountStatusDto.parse(body);

    const {user_id, account_status} = validatedData;
    // 🔹 Update the account status in the database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedUserAccountStatus = await prisma.user.update({
      where: { user_id },
      data: { account_status },
    });
    
    return NextResponse.json({ message: "Account status updated successfully" }, { status: 200 });
    
  } catch (error) {
    return handleApiError(error);
  }
}
