import { NextRequest, NextResponse } from "next/server";
import { CreateUserDto } from "@/dto/user.dto";
import { handleApiError } from "@/app/utils/errorHandler";
import { UserModel } from "@/models/userModel";
import { UserDetailsModel } from "@/models/userDetailsModel";
import { OnlineStatus } from "@/types/onlineStatus";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// 📌 GET: Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        user_id: true,       // Include user_id
        email: true,         // Include email
        role: true,          // Include role
        account_status: true, // Include account status
        userDetails: {       // Include userDetails (LEFT JOIN-like behavior)
          select: {
            first_name: true,
            middle_name: true,
            last_name: true,
            course: true,
            online_status: true,
            profile_image: true,
            thresh_hold: true,
          }
        }
      }
    });    
    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error fetching users: " + error }, { status: 500 });
  }
}

// 📌 POST: Create a new user
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();

      // 🛑 Validate request body
      const validatedData = CreateUserDto.parse(body);

      const userData: Omit<UserModel, "user_id"> = {
          email: validatedData.email,
          password: validatedData.password,
          role: validatedData.role,
          account_status: validatedData.account_status,
      };

      // ✅ Convert Base64 to Buffer properly
      const profileImageBuffer = validatedData.profile_image
          ? Buffer.from(validatedData.profile_image, "base64") // Ensure it's a string
          : null;

      const userDetailsData: Omit<UserDetailsModel, "user_id"> = {
          first_name: validatedData.first_name,
          middle_name: validatedData.middle_name,
          last_name: validatedData.last_name,
          course: validatedData.course ?? null,
          online_status: validatedData.online_status ?? OnlineStatus.OFFLINE,
          profile_image: profileImageBuffer,
          thresh_hold: 0,
      };      

      // 🔍 Check if email already exists
      const existingUser = await prisma.user.findUnique({
          where: { email: userData.email },
      });

      if (existingUser) {
          throw new Error("Email is already in use. Please use a different email.");
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

    // ✅ Transaction to create both user and user details
      const newUser = await prisma.$transaction(async (tx) => {
          const createdUser = await tx.user.create({
              data: {
                  email: userData.email,
                  password: hashedPassword,
                  role: userData.role,
                  account_status: userData.account_status,
                  userDetails: {
                      create: {
                          first_name: userDetailsData.first_name,
                          middle_name: userDetailsData.middle_name,
                          last_name: userDetailsData.last_name,
                          course: userDetailsData.course,
                          online_status: userDetailsData.online_status,
                          profile_image: userDetailsData.profile_image, // ✅ Buffer for Blob storage
                      },
                  },
              },
              include: { userDetails: true }, // ✅ Include user details in response
          });
          console.log("createdUser: " + createdUser);
          return createdUser;
      });

      if (!newUser) throw new Error("User registration failed.");

      console.log("newUser: " + newUser);
      
      // ✅ Convert Buffer to Base64 when returning JSON response
      return NextResponse.json(
          {                
              success: "Registration has been successfully, please wait for the approval of the admin!"
          },
          { status: 201 }
      );

  } catch (error) {
      
      return handleApiError(error);
  }
}

