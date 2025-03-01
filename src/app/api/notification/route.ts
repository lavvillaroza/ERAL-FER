import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

/**
 * GET: Fetch all notifications
 */
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany();
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return handleApiError(error);
  }
}

/**
 * POST: Create a new notification
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message, user_id, color_code, status, for_admin } = body;

    if (!title || !message || !color_code || !for_admin) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newNotification = await prisma.notification.create({
      data: {
        title,
        message,
        user_id: user_id || 0,
        color_code,
        status: status || 0,
        for_admin,
      },
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return handleApiError(error);
  }
}
