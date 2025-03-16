import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwtPayload } from "./lib/decodeJwt";

// Define allowed paths for each role
const rolePaths = {
  admin: ["/admin"],
  teacher: ["/teacher"],
  student: ["/student"],
};

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const authToken = req.cookies.get("auth_token")?.value; // Get user role from cookie
  const refreshToken = req.cookies.get("refresh_token")?.value; // Get user role from cookie
  const url = req.nextUrl.clone();  

  if (!authToken ) {        
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!refreshToken ) {        
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decodeRefreshToken = decodeJwtPayload(refreshToken);
  if (!decodeRefreshToken) {    
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  const decodedAuthToken = decodeJwtPayload(authToken);

  if (!decodedAuthToken) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect if token is invalid
  }
  
  const userRole = decodedAuthToken.role;

  // If there's no role, redirect to login
  if (!userRole) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

   // Redirect based on role
   if (url.pathname === "/") {
    switch (userRole) {
      case "admin":
        return NextResponse.redirect(new URL("/admin", req.url));
      case "teacher":
        return NextResponse.redirect(new URL("/teacher", req.url));
      case "student":
        return NextResponse.redirect(new URL("/student", req.url));
      default:
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Get allowed paths for this role
  const allowedPaths = rolePaths[userRole as keyof typeof rolePaths] || [];
  
  // Check if the user is trying to access an unauthorized page
  if (!allowedPaths.some((path) => nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/", "/admin/:path*", "/teacher/:path*", "/student/:path*"],
};