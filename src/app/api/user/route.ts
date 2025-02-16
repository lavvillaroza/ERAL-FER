import { NextRequest, NextResponse } from "next/server";
import { CreateUserDto } from "@/dto/user.dto";
import { handleApiError } from "@/app/utils/errorHandler";
import { UserService } from "@/services/userService";

// 📌 GET: Fetch all users
export async function GET() {
  try {
    const users = await UserService.getAllUsers();    
    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error fetching users: " + error }, { status: 500 });
  }
}

// 📌 POST: Create a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();    
    const validatedData = CreateUserDto.parse(body);
    const newUser = await UserService.createNewUser(validatedData);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

