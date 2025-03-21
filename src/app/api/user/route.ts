import { NextRequest, NextResponse } from "next/server";
import { CreateUserDto } from "@/dto/user.dto";
import { handleApiError } from "@/app/utils/errorHandler";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// 📌 GET: Fetch all users
export async function GET(req: NextRequest) {
  try {    

    // Parse query parameters from the URL
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role"); // 'current' or 'completed'
    

    // Build query filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      role: role,
    };
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        userDetails: true,
      },
    });    
    return NextResponse.json(
      {            
        success: true,
        message: "Fetched all users successfully!",
        data: users
      },
      { status: 201 }
  );

  } catch (error) {
    return handleApiError(error);
  }
}

// 📌 POST: Create a new user
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();

      // 🛑 Validate request body
      const validatedData = CreateUserDto.parse(body);
      
      // ✅ Convert Base64 to Buffer properly
      const profileImageBuffer = validatedData.profile_image
          ? Buffer.from(validatedData.profile_image, "base64") // Ensure it's a string
          : null;

      // 🔍 Check if email already exists
      const existingUser = await prisma.user.findUnique({
          where: { email: validatedData.email },
      });

      if (existingUser) {
          throw new Error("Email is already in use. Please use a different email.");
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // ✅ Transaction to create both user and user details
      const newUser = await prisma.$transaction(async (tx) => {
          const createdUser = await tx.user.create({
              data: {
                  email: validatedData.email,
                  password: hashedPassword,
                  role: validatedData.role,
                  account_status: validatedData.account_status,
                  userDetails: {
                      create: {
                          first_name: validatedData.first_name,
                          middle_name: validatedData.middle_name,
                          last_name: validatedData.last_name,
                          course: validatedData.course,
                          online_status: validatedData.online_status,
                          profile_image: profileImageBuffer, // ✅ Buffer for Blob storage
                      },
                  },
              },
              include: { userDetails: true }, // ✅ Include user details in response
          });
          console.log("createdUser: " + createdUser);
          return createdUser;
      });

      if (!newUser) throw new Error("User registration failed.");      

      // ✅ Convert Buffer to Base64 when returning JSON response
      return NextResponse.json(
          {            
            success: true,
            message: "Registration has been successfully, please wait for the approval of the admin!",
            data: newUser
          },
          { status: 201 }
      );
  } catch (error) {          
      return handleApiError(error);
  }
}

