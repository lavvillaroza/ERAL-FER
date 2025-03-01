import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const userRole = req.cookies.get("user_role")?.value; // Get the user role from cookie    

    if (!userRole) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user_role: userRole });
}