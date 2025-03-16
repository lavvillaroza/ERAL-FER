import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY!;
export async function GET(req: NextRequest) {    
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
    else {
        return NextResponse.json({ success: false, message: decodedAuthToken.message || "Invalid Auth Token!", }, { status: 401 });
    }
}