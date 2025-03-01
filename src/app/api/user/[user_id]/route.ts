import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

// 📌 GET: Fetch a single user by ID
export async function GET(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const user_id = parseInt(params.user_id);
    if (isNaN(user_id)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { user_id },
      include: { userDetails: true }, // Include UserDetails
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return handleApiError({ error: "Error fetching user by ID: " + error });    
  }
}

export async function PUT(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const user_id = parseInt(params.user_id);
    if (isNaN(user_id)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });

    const { email, password, role, account_status, userDetails } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: {
        email,
        password,
        role,
        account_status,
        updated_date: new Date(),
        userDetails: userDetails
          ? { update: { ...userDetails, updated_date: new Date() } }
          : undefined,
      },
      include: { userDetails: true },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE: Remove user (cascade deletes UserDetails)
 */
export async function DELETE(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const user_id = parseInt(params.user_id);
    if (isNaN(user_id)) return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });

    await prisma.user.delete({
      where: { user_id },
    });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}