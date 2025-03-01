import { NextRequest } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signRefreshToken, signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("Invalid email or password");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid email or password");

        if (user.account_status === "new" || user.account_status === "deactivated") {
            return NextResponse.json({
              message: "Your account is not activated yet. Please wait for admin approval.",
              status: 403
            })

        } 

        // Generate tokens
        const accessToken = signToken({ id: user.user_id, email: user.email, role: user.role });
        const refreshToken = signRefreshToken({ id: user.user_id, email: user.email });

         // ✅ Store tokens and role in cookies
         const response = NextResponse.json({ 
            message: "Login successful!", 
            status: 202,
            user: { 
                id: user.user_id,
                email: user.email,                                               
            } 
        });

        response.cookies.set("auth_token", accessToken, { httpOnly: true, secure: true, path: "/" });
        response.cookies.set("refresh_token", refreshToken, { httpOnly: true, secure: true, path: "/" });
        response.cookies.set("user_role", user.role, { httpOnly: true, secure: true, path: "/" });

        return response;    
    
  } catch (error) {
     return handleApiError(error);
  }
}