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
  const role = req.cookies.get("user_role")?.value.toLowerCase(); // Get user role from cookie
  const url = req.nextUrl.clone();

  console.log(role);
  // If there's no role, redirect to login
  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

   // Redirect based on role
   if (url.pathname === "/") {
    switch (role) {
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
  const allowedPaths = rolePaths[role as keyof typeof rolePaths] || [];
  console.log("Allowed Paths:", allowedPaths);
  
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