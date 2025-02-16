import prisma from "@/lib/prisma";
import { UserModel } from "@/models/userModel";
import bcrypt from "bcryptjs";

export class UserService {
    // Get all users
    static async getAllUsers() {
        return await prisma.user.findMany();
    }

    // Get user by ID
    static async getUserById(user_id: number) {
      return prisma.user.findUnique({ where: { user_id } });
    }

    // Create new user
    static async createNewUser(data: Omit<UserModel, "user_id">)  {        
        data.password = await bcrypt.hash(data.password, 10);
        return await prisma.user.create({
            data,
          });
    }
  
    // Update user password
    static async updatePassword(user_id: number, password: string) {
      const hashedPassword = await bcrypt.hash(password, 10);
      return prisma.user.update({
        where: { user_id },
        data: { password: hashedPassword },
      });
    }
  
    // Update user account status
    static async updateAccountStatus(user_id: number, account_status: string) {
      return prisma.user.update({
        where: { user_id },
        data: { account_status },
      });
    }
  }
