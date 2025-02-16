import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/authService";
import { handleApiError } from "@/app/utils/errorHandler";
import { RegisterUserDto } from "@/dto/user.dto";
import { UserModel } from "@/models/userModel";
import { UserDetailsModel } from "@/models/userDetailsModel";
import { OnlineStatus } from "@/types/onlineStatus";
import { Buffer } from "buffer"; // ✅ Import Buffer

// ✅ Handle POST request
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 🛑 Validate request body
        const validatedData = RegisterUserDto.parse(body);

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
            name: validatedData.name,
            course: validatedData.course ?? null,
            online_status: validatedData.online_status ?? OnlineStatus.OFFLINE,
            profile_image: profileImageBuffer,
        };      

        const newUser = await AuthService.register(
            userData,  // UserModel
            userDetailsData // UserDetailsModel
        );
        if (!newUser) throw new Error("User registration failed.");
        
        // ✅ Convert Buffer to Base64 when returning JSON response
        return NextResponse.json(
            {
                ...newUser,
                userDetails: newUser.userDetails
                    ? {
                          ...newUser.userDetails,
                          profile_image: newUser.userDetails.profile_image
                              ? Buffer.from(newUser.userDetails.profile_image).toString("base64")
                              : null,
                      }
                    : null, // ✅ Ensure it remains null if userDetails is null
            },
            { status: 201 }
        );
  
    } catch (error) {
        
        return handleApiError(error);
    }
  }