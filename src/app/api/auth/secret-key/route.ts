import { NextResponse } from "next/server";

export async function GET() {
    const secretKey = process.env.SECRET_KEY!;
        
    if (!secretKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ secret_key: secretKey });
}