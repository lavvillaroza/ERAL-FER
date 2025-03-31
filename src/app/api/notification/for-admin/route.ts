import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

/**
 * GET: Fetch a notification by ID
 */
export async function GET() {
  try {
    const result = await prisma.$queryRaw<Array<{          
      id: number;
      name: string; 
      time: Date;           
      role: string;      
    }>>`
        SELECT A.id, A.message as name, A.datetime_stamp as time, B.role
        FROM dberal.Notification A
        LEFT JOIN dberal.User B ON B.user_id = A.user_id
        ORDER BY A.id DESC
      `;

    console.log(result);

    return NextResponse.json({
      success: true,
      message: "Successfully Aggregated Overall FER data",
      data: result}, 
      { status: 200 });

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