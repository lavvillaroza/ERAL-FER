import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const authToken = req.cookies.get("auth_token")?.value; // Get the user role from cookie 
        
    if (!authToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ auth_token: authToken });
}