import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/utils/errorHandler";
import { RegisterUserDto } from "@/dto/user.dto";
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
    
         // 🔍 Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            throw new Error("Email is already in use, please use a different email.");
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
                            online_status: validatedData.online_status ?? OnlineStatus.OFFLINE,
                            profile_image: profileImageBuffer, // ✅ Buffer for Blob storage                            
                        },
                    },
                },
                include: { userDetails: true }, // ✅ Include user details in response
            });            
            return createdUser;
        });

        if (!newUser) throw new Error("User registration failed.");    
        
        const newNotification = await prisma.notification.create({
          data: {
            title: "New User Registered",
            message: `${newUser.userDetails?.first_name} ${newUser.userDetails?.middle_name} ${newUser.userDetails?.last_name}`,
            user_id: newUser.user_id, // Convert if necessary, default to 0
            color_code: "0",
            status:  0, // Convert if necessary, default to 0
            for_admin: "Y",
          },
        });

        console.log(newNotification);
        
        if (newUser.role === "teacher") {
            const responsecreateDefaulThreshold = await prisma.userTeacherThreshold.createMany({
                data: [
                  {
                    user_id: newUser.user_id,
                    expression_type: 'sad',
                    message: 'Need improvement in participation.',
                    threshold: 50.00,                    
                  },
                  {
                    user_id: newUser.user_id,
                    expression_type: 'angry',
                    message: 'Take a deep breath. Lets find a solution together.',
                    threshold: 50.00,                    
                  },
                  {
                    user_id: newUser.user_id,
                    expression_type: 'disgusted',
                    message: 'Something seems off. Lets see how we can improve this.',
                    threshold: 50.00,                    
                  },
                  {
                    user_id: newUser.user_id,
                    expression_type: 'fearful',
                    message: 'You got this! Dont let fear hold you back.',
                    threshold: 50.00,                    
                  },
                  {
                    user_id: newUser.user_id,
                    expression_type: 'na',
                    message: 'Are you still there?',
                    threshold: 50.00,                    
                  },
                ],
              })              
            console.log(responsecreateDefaulThreshold.count);
        }  
        
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
        console.error("Registration Error:", error);   
        return handleApiError(error);
    }
  }