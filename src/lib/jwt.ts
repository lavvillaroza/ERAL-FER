import jwt from "jsonwebtoken";

const SECRET_KEY  = process.env.SECRET_KEY || "ERALFERSYSTEM"; // Store in .env
const REFRESH_SECRET_KEY  = process.env.REFRESH_SECRET_KEY || "ERALFERSYSTEM"; // Store in .env

// Generate Access Token (Short-lived)
export const signToken = (payload: object) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "15m" });
};

// Generate Refresh Token (Long-lived)
export function signRefreshToken(payload: object) {
    return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "7d" });
}

// Verify Access Token
export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};

// Verify Refresh Token
export function verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET_KEY);
}