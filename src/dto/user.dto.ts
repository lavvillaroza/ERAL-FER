import { z } from "zod";
import { UserRole } from "@/types/userRole";
import { AccountStatus } from "@/types/accountStatus";
import { OnlineStatus } from "@/types/onlineStatus";


/**
 * DTO for register a new user
 */

export const RegisterUserDto = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.nativeEnum(UserRole),  // ✅ Uses TypeScript Enum
    account_status: z.nativeEnum(AccountStatus),  // ✅ Uses TypeScript Enum
    name: z.string().min(2, "Name must be at least 2 characters"),
    course: z.string().optional(),
    online_status: z.nativeEnum(OnlineStatus).optional(),
     // ✅ Accept Base64 string or null
     profile_image: z.string().optional().nullable().refine((val) => {
        if (!val) return true; // Allow null or undefined
        return /^[A-Za-z0-9+/=]+$/.test(val); // Simple Base64 validation
    }, "Invalid Base64 format for profile image"),
  });
/**
 * DTO for creating a new user
 */

export const CreateUserDto = z.object({  
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.nativeEnum(UserRole),  // ✅ Uses TypeScript Enum
    account_status: z.nativeEnum(AccountStatus),  // ✅ Uses TypeScript Enum
    name: z.string().min(2, "Name must be at least 2 characters"),
    course: z.string().optional(),
    online_status: z.nativeEnum(OnlineStatus).optional(),
     // ✅ Accept Base64 string or null
     profile_image: z.string().optional().nullable().refine((val) => {
        if (!val) return true; // Allow null or undefined
        return /^[A-Za-z0-9+/=]+$/.test(val); // Simple Base64 validation
    }, "Invalid Base64 format for profile image"),
});

/**
 * DTO for updating a user password
 */

export const UpdateUserPasswordDto = z.object({
    user_id: z.number().int({ message: "user_id must be a valid integer" }),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

/**
 * DTO for updating a user acccount status
 */

export const UpdateUserAccountStatusDto = z.object({
    user_id: z.number().int({ message: "user_id must be a valid integer" }),
    account_status: z.nativeEnum(AccountStatus),
  });