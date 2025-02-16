import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define allowed paths for each role
const rolePaths = {
  admin: ["/admin"],
  teacher: ["/teacher"],
  student: ["/student"],
};

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const role = req.cookies.get("user_role")?.value; // Get user role from cookie

  // If there's no role, redirect to login
  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Get allowed paths for this role
  const allowedPaths = rolePaths[role as keyof typeof rolePaths] || [];

  // Check if the user is trying to access an unauthorized page
  if (!allowedPaths.some((path) => nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"], // Apply only to protected paths
};
