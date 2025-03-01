import { handleApiError } from "@/app/utils/errorHandler";
import { NextResponse } from "next/server";

export async function POST() {
  try {    
      const response = NextResponse.json({ message: "Logout successful!" });        
      // Clear authentication cookies
      response.cookies.set("auth_token", "", { httpOnly: true, secure: true, path: "/", expires: new Date(0) });
      response.cookies.set("refresh_token", "", { httpOnly: true, secure: true, path: "/", expires: new Date(0) });
      response.cookies.set("user_role", "", { httpOnly: true, secure: true, path: "/", expires: new Date(0) });
    
      return response;
    
  } catch (error) {
     return handleApiError(error);
  }
}