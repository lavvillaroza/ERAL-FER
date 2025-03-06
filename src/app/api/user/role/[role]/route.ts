import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { role: string } }) {
    try {
      const { role } = await params;
            
      const users = await prisma.user.findMany({
        where: { role: role }, // Filter users by role
        select: {
          user_id: true,
          email: true,
          role: true,
          account_status: true,
          created_date: true,
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
            
      return NextResponse.json(users, { status: 200 });
  
    } catch (error) {
      return handleApiError({ error: "Error fetching users by role: " + error });
    }
  }
  