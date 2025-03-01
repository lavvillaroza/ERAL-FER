import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";


/**
 * GET: Fetch all system logs
 */
export async function GET() {
  try {
    const logs = await prisma.systemLogs.findMany();
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return handleApiError(error);
  }
}

/**
 * POST: Create a new system log
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { level, message, exception, entity_name, user_id, for_admin } = body;

    if (!level || !message || !entity_name || !for_admin) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newLog = await prisma.systemLogs.create({
      data: {
        level,
        message,
        exception: exception || "",
        entity_name,
        user_id: user_id || 0,
        for_admin,
      },
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("GET Error:", error);
    return handleApiError(error);
  }
}
