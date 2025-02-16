import { NextRequest, NextResponse } from "next/server";
import { UpdateUserAccountStatusDto } from "@/dto/user.dto";
import { handleApiError } from "@/app/utils/errorHandler";
import { UserService } from "@/services/userService";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ Validate input using DTO
    const validatedData = UpdateUserAccountStatusDto.parse(body);

    // 🔹 Update the account status in the database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedUserAccountStatus = await UserService.updateAccountStatus(validatedData.user_id, validatedData.account_status);
    return NextResponse.json({ message: "Account status updated successfully" }, { status: 200 });
    
  } catch (error) {
    return handleApiError(error);
  }
}
