import { NextResponse } from "next/server";

export async function GET() {
    const refereshSecretKey = process.env.REFRESH_SECRET_KEY!;
        
    if (!refereshSecretKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ refresh_secret_key: refereshSecretKey });
}