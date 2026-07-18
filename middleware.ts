import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow public routes
  const publicPaths = ["/", "/login", "/register"];
  const { pathname } = request.nextUrl;

  if (publicPaths.includes(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // For dashboard routes, we'll handle auth client-side
  // In production, you might want to check for tokens here
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

