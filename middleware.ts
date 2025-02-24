import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "app_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has(TOKEN); // Adjust cookie name based on your auth implementation

  // If user is logged in and trying to access login page
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/login",
};
