import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { role: string } }) {
    try {
      const role = params.role; // Extract role from request params
  
      const users = await prisma.user.findMany({
        where: { role: role }, // Filter users by role
        select: {
          user_id: true,
          email: true,
          role: true,
          account_status: true,
          userDetails: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true,
              course: true,
              online_status: true,
              profile_image: true,
              thresh_hold: true,
            },
          },
        },
      });
  
      if (users.length === 0) {
        return NextResponse.json({ message: "No users found with this role" }, { status: 404 });
      }
  
      return NextResponse.json(users, { status: 200 });
  
    } catch (error) {
      return handleApiError({ error: "Error fetching users by role: " + error });
    }
  }
  