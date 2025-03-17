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

export const GetIntialName = (user: UserDetailsModel | undefined) => {
    if (!user) {
        return "U"; // Default to "U" for Unknown
    }

    return [user.first_name, user.middle_name, user.last_name]
    .filter((name): name is string => Boolean(name)) // Remove null/undefined
    .map(name => name.charAt(0)) // Get the first letter
    .join(""); // Join letters together
};