import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signRefreshToken, signToken } from "@/lib/jwt";
import { UserModel } from "@/models/userModel";
import { UserDetailsModel } from "@/models/userDetailsModel";
import { NextResponse } from "next/server";

export class AuthService {

    // Register User
    static async register(
    userData: Omit<UserModel, "user_id">, 
    userDetailsData: Omit<UserDetailsModel, "user_id">
    ) {

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
                            name: userDetailsData.name,
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

        console.log("newUser: " + newUser);
        return newUser; // ✅ Return user object
    }

    // Login User
    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("Invalid email or password");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid email or password");

        // Generate tokens
        const accessToken = signToken({ id: user.user_id, email: user.email, role: user.role });
        const refreshToken = signRefreshToken({ id: user.user_id, email: user.email });

         // ✅ Store tokens and role in cookies
         const response = NextResponse.json({ 
            message: "Login successful!", 
            role: user.role 
        });

        response.cookies.set("auth_token", accessToken, { httpOnly: true, secure: true, path: "/" });
        response.cookies.set("refresh_token", refreshToken, { httpOnly: true, secure: true, path: "/" });
        response.cookies.set("user_role", user.role, { httpOnly: true, secure: true, path: "/" });

        return response;
    }
}
