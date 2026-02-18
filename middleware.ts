// =====================
// AUTH DISABLED
// The following authentication middleware logic is commented out for maintenance or disabling auth.
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// const protectedRoutes = [
//   { path: "/register", cookie: "user_session_id" },
//   { path: "/dashboard", cookie: "admin_session_id" },
//   { path: "/superadmin", cookie: "superadmin_session_id" },
// ];
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   // Check for all roles
//   const isSuperadmin = !!request.cookies.get("superadmin_session_id");
//   const isAdmin = !!request.cookies.get("admin_session_id");
//   const isUser = !!request.cookies.get("user_session_id");
//   // Only allow access if the user has the required cookie for the route
//   for (const route of protectedRoutes) {
//     if (pathname.startsWith(route.path)) {
//       const cookie = request.cookies.get(route.cookie);
//       if (!cookie) {
//         const loginUrl = new URL("/login", request.url);
//         loginUrl.searchParams.set("redirect", pathname);
//         return NextResponse.redirect(loginUrl);
//       }
//     }
//   }
//   // No forced redirect for superadmin; allow access to all
//   return NextResponse.next();
// }
// export const config = {
//   matcher: ["/register/:path*", "/dashboard/:path*", "/superadmin/:path*"],
// };
// AUTH DISABLED: No authentication middleware is currently active.

// No-op middleware to satisfy Next.js build requirements
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  return NextResponse.next();
}
