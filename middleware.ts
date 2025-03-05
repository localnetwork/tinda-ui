import { NextResponse, NextRequest } from "next/server";

const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "app_token";

const PROTECTED_ROUTES = ["/seller-center", "/store"];
const AUTH_ROUTE = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has(TOKEN);
  const isAuthPage = pathname === AUTH_ROUTE;
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect authenticated users away from login page
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [AUTH_ROUTE, "/store/:slug", "/seller-center"],
};
