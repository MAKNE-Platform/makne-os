import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("MIDDLEWARE HIT:", pathname);


  // Allow auth routes explicitly
  if (
    pathname === "/" ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  // Protect dashboard & app routes
  if (pathname.startsWith("/dashboard")) {
    const authSession = request.cookies.get("auth_session");

    if (!authSession) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
