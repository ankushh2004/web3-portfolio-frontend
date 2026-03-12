import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("Middleware - Token:", token);
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/";
  const isProtectedRoute =
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/vault") ||
    pathname.startsWith("/activity");

  // if not logged in and accessing a protected route → redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // if logged in and accessing the auth page → redirect to portfolio
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/portfolio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/portfolio/:path*", "/vault/:path*", "/activity/:path*"],
};
