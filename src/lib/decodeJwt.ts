export function decodeJwtPayload(token: string) {
    try {
        console.log("Token:", token);
        const payloadBase64 = token.split(".")[1]; // Get the payload part
        const decodedPayload = JSON.parse(atob(payloadBase64));
        // Check if the token is expired
        if (decodedPayload.exp * 1000 < Date.now()) {
            console.log("Token expired");
            return null;
        }
        return decodedPayload; // Return the user data
    } catch (error) {
        console.log("Failed to decode JWT:", error);
        return null;
    }
}