import { UserDetailsModel } from "@/models/userDetailsModel";

// Helper function to format full name
export const GetFullName = (user: UserDetailsModel | undefined) => {
    if (!user) {
        return "Unknown";

    }
    else {
        return [user.first_name, user.middle_name, user.last_name]
        .filter(Boolean) // Removes null/undefined values
        .join(" ");
    }    
};