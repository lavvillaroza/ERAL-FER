import { handleApiError } from "@/app/utils/errorHandler";
import { verifyToken } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY!;

export async function GET(req: NextRequest) {
    try {   
        // 🔹 Get auth token from HTTP-only cookies
        const authToken = req.cookies.get("auth_token")?.value;            

        if (!authToken) {            
          return NextResponse.json({ success: false, message: "No auth token found to get the user role!123" }, { status: 401 });
        }
    
        // Verify refresh token
        const decodedAuthToken = verifyToken(authToken, SECRET_KEY);        

        if (!decodedAuthToken.valid) {
          return NextResponse.json({ success: false, message: "Invalid auth token to get the user role!" }, { status: 403 });
        }
        if (decodedAuthToken.expired) {
          return NextResponse.json({ success: false, message: "Auth Token is already expired" }, { status: 403 });
        }

        // ✅ Cast decoded token as JwtPayload to access `role`
        const decodedPayload = decodedAuthToken.decoded as JwtPayload;

        return NextResponse.json({ success: true, message: "Fetch user role successfully!", data: {role: decodedPayload.role} }, { status: 200 });        
  
      } catch (error) {        
        console.error("Fetched Role Error:", error);   
        return handleApiError(error);        
      }
}