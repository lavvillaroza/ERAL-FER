import jwt, { JwtPayload } from "jsonwebtoken";

// Generate Access Token (Short-lived)
export const signToken = (payload: object, SECRET_KEY: string) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
};

// Generate Refresh Token (Long-lived)
export function signRefreshToken(payload: object, REFRESH_SECRET_KEY: string) {
    return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "2d" });
}

// Verify Access Token
export const verifyToken = (token: string, SECRET_KEY: string) => {  
  try {    
    const decoded = jwt.verify(token, SECRET_KEY);    
    return { valid: true, expired: false, decoded: decoded };
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "TokenExpiredError") {
          return { valid: false, expired: true, message: "Auth Token has expired" };
      } else if (err.name === "JsonWebTokenError") {
          return { valid: false, expired: false, message: "Invalid Auth Token" };
      }
    }
    return { valid: false, expired: false, message: "Unknown error verifying auth token" };
  }
};

// Verify Refresh Token
export function verifyRefreshToken(token: string, REFRESH_SECRET_KEY: string) {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET_KEY) as JwtPayload;
    return { valid: true, expired: false, decoded: decoded };
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "TokenExpiredError") {
          return { valid: false, expired: true, message: "Refresh Token has expired" };
      } else if (err.name === "JsonWebTokenError") {
          return { valid: false, expired: false, message: "Invalid Refresh Token" };
      }
    }
    return { valid: false, expired: false, message: "Unknown error verifying refresh token" };
  }
}

