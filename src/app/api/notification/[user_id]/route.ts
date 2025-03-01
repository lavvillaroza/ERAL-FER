import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

/**
 * GET: Fetch a notification by ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user_id = parseInt(params.id);
    if (isNaN(user_id)) return NextResponse.json({ message: "Invalid UserID" }, { status: 400 });

    const notifications = await prisma.notification.findMany({
        where: { user_id },
        orderBy: { datetime_stamp: "desc" }, // Newest first
      });

      return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return handleApiError(error);
  }
}

/**
 * PATCH: Update notification status to Read (status = 1)
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { status: 1 },
    });

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return handleApiError(error);
  }
}

/**
 * DELETE: Remove a notification by ID
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    await prisma.notification.delete({ where: { id } });
    return NextResponse.json({ message: "Notification deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return handleApiError(error);
  }
}
