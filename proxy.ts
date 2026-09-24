
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Get the token from the cookie
  const token = request.cookies.get("token")?.value;

  // If there is no token, user is not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token exists, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/discover/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};

