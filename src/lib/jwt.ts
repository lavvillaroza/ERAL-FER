import jwt from "jsonwebtoken";

// Generate Access Token (Short-lived)
export const signToken = (payload: object, SECRET_KEY: string) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "15m" });
};

// Generate Refresh Token (Long-lived)
export function signRefreshToken(payload: object, REFRESH_SECRET_KEY: string) {
    return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "7d" });
}

// Verify Access Token
export const verifyToken = (token: string, SECRET_KEY: string) => {
  return jwt.verify(token, SECRET_KEY);
};

// Verify Refresh Token
export function verifyRefreshToken(token: string, REFRESH_SECRET_KEY: string) {
    return jwt.verify(token, REFRESH_SECRET_KEY);
}

//Get user_id from Token
export function getUserIdFromToken(token: string) {
  try {
    if (!token) {
      console.error("Token is missing");
      return null;
    }
    
    // Decode without verifying
    const decodedWithoutVerify = jwt.decode(token) as jwt.JwtPayload | null;
    //console.log("Decoded (without verify):", decodedWithoutVerify);

    if (!decodedWithoutVerify) {
      console.error("Token is not properly formatted");
      return null;
    }
    
    
    //const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;    

    return decodedWithoutVerify;

  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}