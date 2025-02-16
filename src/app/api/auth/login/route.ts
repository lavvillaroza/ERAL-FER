import { NextRequest } from "next/server";
import { AuthService } from "@/services/authService";
import { handleApiError } from "@/app/utils/errorHandler";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    // Call AuthService login method
    return await AuthService.login(email, password);    
    
  } catch (error) {
     return handleApiError(error);
  }
}