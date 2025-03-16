import { handleApiError } from "@/app/utils/errorHandler";
import { signToken, verifyRefreshToken, verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY!;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET!;

export async function POST(req: NextRequest) {
    try {
        // 🔹 Get auth token from HTTP-only cookies
        const authToken = req.cookies.get("auth_token")?.value;            

        if (!authToken) {            
            return NextResponse.json({ success: false, message: "No auth token found!" }, { status: 401 });
        }
        // Verify auth token
        const decodedAuthToken = verifyToken(authToken, SECRET_KEY);
        // ✅ Token is still valid, no need to refresh
        if (decodedAuthToken.valid && !decodedAuthToken.expired) {
            return NextResponse.json({ success: true, message: "Valid Auth Token!", data: decodedAuthToken.decoded }, { status: 200 });
        }

        // ✅ Token is expired, check for refresh token
        if (decodedAuthToken.expired) {
            const refreshToken = req.cookies.get("refresh_token")?.value;

            if (!refreshToken) {
                return NextResponse.json({ success: false, message: "No refresh token" }, { status: 401 });
            }

            // Verify refresh token
            const decodedRefreshToken = verifyRefreshToken(refreshToken, REFRESH_SECRET_KEY);

            if (!decodedRefreshToken.valid) {
                return NextResponse.json({ success: false, message: decodedRefreshToken?.message || "Invalid refresh token" }, { status: 401 });
            }

            // Check if user exists
            const user = await prisma.user.findUnique({ where: { user_id: decodedRefreshToken.decoded?.id } });

            if (!user) {
                return NextResponse.json({ success: false, message: "Invalid Refresh Token! User not found." }, { status: 404 });
            }

            // 🔹 Generate new access token
            const newAccessToken = signToken({ id: user.user_id, email: user.email, role: user.role }, SECRET_KEY);

            // 🔹 Set new token in HTTP-only cookies
            const response = NextResponse.json({ 
                success: true, 
                message: "Token refreshed", 
                data: { id: user.user_id, email: user.email, role: user.role }
            }, { status: 200 });

            response.cookies.set("auth_token", newAccessToken, { 
                httpOnly: true, secure: true, path: "/", sameSite: "strict" 
            });

            return response;
        }              

        // Fallback for unknown errors
        return NextResponse.json({ success: false, message: "Unexpected token verification error!" }, { status: 401 });

    } catch (error) {
        console.error("Refresh Token Error:", error);
        return handleApiError(error);
    }
}
