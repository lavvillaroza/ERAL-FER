import { NextRequest } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signRefreshToken, signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY!;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
      const { email, password } = await req.json();

      // Check if user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
          console.error("User not found:", email);
          return NextResponse.json(
            { 
                success: false,
                message: "Invalid credentials" }, 
                { status: 401 }
            );
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.error("Password mismatch for user:", email);
          return NextResponse.json(
            { 
                success: false,
                message: "Invalid credentials" }, 
                { status: 401 }
            );
      }

      if (user.account_status === "new") {
          return NextResponse.json(
            {
                success:false,
                message: "Your account is not activated yet. Please wait for admin approval."},
                { status: 403 }
            );
      }

      if (user.account_status === "disabled") {
        return NextResponse.json(
          {
              success:false,
              message: "Your account is disabled. Please contact the administration."},
              { status: 403 }
          );
    }

      // Generate tokens
      const accessToken = signToken({ id: user.user_id, email: user.email, role: user.role }, SECRET_KEY);
      const refreshToken = signRefreshToken({ id: user.user_id, email: user.email, role: user.role }, REFRESH_SECRET_KEY);

      // Set cookies securely
      const response = NextResponse.json(
        { 
            success: true,
            message: "Login successful!", 
            data: {role: user.role}},
            {status: 202 } //202 Accepted – The request has been received but is still being processed.
        );
        
      response.cookies.set("auth_token", accessToken, { httpOnly: true, secure: true, path: "/", sameSite: "strict" });
      response.cookies.set("refresh_token", refreshToken, { httpOnly: true, secure: true, path: "/", sameSite: "strict" });      
      return response;
      
  } catch (error) {
      console.error("Login API Error:", error);
      return handleApiError(error);
  }
}