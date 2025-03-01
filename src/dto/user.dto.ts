import { z } from "zod";
import { AccountStatus } from "@/types/accountStatus";


/**
 * DTO for register a new user
 */

export const RegisterUserDto = z.object({
      email: z.string().email("Invalid email format"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
      role: z.string(), // Validate UserRole enum
      account_status: z.string().default("new"),  // ✅ Uses TypeScript Enum
      first_name: z.string().min(2, "First Name must be at least 2 characters"),
      middle_name: z.string().nullable(),
      last_name: z.string().min(2, "Last Name must be at least 2 characters"),
      course: z.string().nullable(),
      online_status: z.string().optional().nullable().default("offline"),
      // ✅ Accept Base64 string or null
      profile_image: z.string().optional().nullable().refine((val) => {
          if (!val) return true; // Allow null or undefined
          return /^[A-Za-z0-9+/=]+$/.test(val); // Simple Base64 validation
      }, "Invalid Base64 format for profile image"),
      thresh_hold: z.number().default(0),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
/**
 * DTO for creating a new user
 */

export const CreateUserDto = z.object({  
      email: z.string().email("Invalid email format"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
      role: z.string(), // Validate UserRole enum
      account_status: z.string().default("new"),  // ✅ Uses TypeScript Enum
      first_name: z.string().min(2, "First Name must be at least 2 characters"),
      middle_name: z.string().nullable(),
      last_name: z.string().min(2, "Last Name must be at least 2 characters"),
      course: z.string().nullable(),
      online_status: z.string().default("offline"),
      // ✅ Accept Base64 string or null
      profile_image: z.string().optional().nullable().refine((val) => {
          if (!val) return true; // Allow null or undefined
          return /^[A-Za-z0-9+/=]+$/.test(val); // Simple Base64 validation
      }, "Invalid Base64 format for profile image"),
      thresh_hold: z.number().default(0),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
    });


/**
 * DTO for updating user profile image
 */
export const UpdateUserProfileImageDto = z.object({      
     // ✅ Accept Base64 string or null
    user_id: z.number().int({ message: "user_id must be a valid integer" }),
    profile_image: z.string().optional().nullable().refine((val) => {
        if (!val) return true; // Allow null or undefined
        return /^[A-Za-z0-9+/=]+$/.test(val); // Simple Base64 validation
    }, "Invalid Base64 format for profile image"),    
});


/**
 * DTO for updating user details
 */
export const UpdateUserDetailsDto = z.object({      
    user_id: z.number().int({ message: "user_id must be a valid integer" }),
    first_name: z.string().min(2, "First Name must be at least 2 characters"),
    middle_name: z.string().nullable(),
    last_name: z.string().min(2, "Last Name must be at least 2 characters"),
    course: z.string().nullable(),
    thresh_hold: z.number().default(0),
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