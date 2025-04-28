import { NextResponse, NextRequest } from "next/server";

const TOKEN = process.env.AUTH_TOKEN || "app_token"; // Use a server-side env variable
const PROTECTED_ROUTES = ["/seller-center", "/store"];
const AUTH_ROUTE = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN)?.value; // Correct way to check cookies
  const isAuthenticated = Boolean(token);
  const isAuthPage = pathname === AUTH_ROUTE;
  const destination = request.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // console.log("token", token);

  // console.log("Middleware Debug:", {
  //   pathname,
  //   token,
  //   isAuthenticated,
  //   isAuthPage,
  //   isProtectedRoute,
  // });

  // Redirect authenticated users away from login page
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(
      new URL(AUTH_ROUTE + `?destination=${destination}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/store/:path*", "/seller-center/:path*"], // Ensure all protected routes are covered
};
