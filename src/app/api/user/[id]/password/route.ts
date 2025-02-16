import { NextRequest, NextResponse } from "next/server";
import { UpdateUserPasswordDto } from "@/dto/user.dto";
import { handleApiError } from "@/app/utils/errorHandler";
import { UserService } from "@/services/userService";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();    
    // ✅ Validate input using DTO
    const validatedData = UpdateUserPasswordDto.parse(body);

    // 🔹 Update the user's password in the database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedUserPassword = await UserService.updatePassword(validatedData.user_id, validatedData.password);
    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    
  } catch (error) {
    return handleApiError(error);
  }
}