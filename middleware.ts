import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  { path: "/register", cookie: "user_session_id" },
  { path: "/dashboard", cookie: "admin_session_id" },
  { path: "/superadmin", cookie: "superadmin_session_id" },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  for (const route of protectedRoutes) {
    if (pathname.startsWith(route.path)) {
      const cookie = request.cookies.get(route.cookie);
      if (!cookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/register/:path*", "/dashboard/:path*", "/superadmin/:path*"],
};
