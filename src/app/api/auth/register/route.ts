import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import { RegisterUserDto } from "@/dto/user.dto";
import { UserModel } from "@/models/userModel";
import { OnlineStatus } from "@/types/onlineStatus";
import { Buffer } from "buffer"; // ✅ Import Buffer
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ✅ Handle POST request
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 🛑 Validate request body
        const validatedData = RegisterUserDto.parse(body);
         // ✅ Convert Base64 to Buffer properly
         const profileImageBuffer = validatedData.profile_image
         ? Buffer.from(validatedData.profile_image, "base64") // Ensure it's a string
         : null;
         
        const userData: Omit<UserModel, "user_id"> = {
            email: validatedData.email,
            password: validatedData.password,
            role: validatedData.role,
            account_status: validatedData.account_status,
            userDetails: {
                user_id: 0,
                first_name: validatedData.first_name,
                middle_name: validatedData.middle_name,
                last_name: validatedData.last_name,
                course: validatedData.course ?? null,
                online_status: validatedData.online_status ?? OnlineStatus.OFFLINE,
                profile_image: profileImageBuffer,
                thresh_hold: 0,
            }
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
                            first_name: userData.userDetails.first_name,
                            middle_name: userData.userDetails.middle_name,
                            last_name: userData.userDetails.last_name,
                            course: userData.userDetails.course,
                            online_status: userData.userDetails.online_status,
                            profile_image: userData.userDetails.profile_image, // ✅ Buffer for Blob storage
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
                message: "Registration has been successfully, please wait for the approval of the admin!",
                data: newUser
            },
            { status: 201 }
        );
  
    } catch (error) {
        
        return handleApiError(error);
    }
  }