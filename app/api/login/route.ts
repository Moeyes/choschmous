// =====================
// AUTH DISABLED
// The following authentication logic is commented out for maintenance or disabling auth.
// import { NextRequest, NextResponse } from "next/server";
// // Demo users
// const users = [
//   {
//     username: "user1",
//     password: "userpass",
//     role: "user",
//     cookie: "user_session_id",
//   },
//   {
//     username: "admin1",
//     password: "adminpass",
//     role: "admin",
//     cookie: "admin_session_id",
//   },
//   {
//     username: "superadmin1",
//     password: "superpass",
//     role: "superadmin",
//     cookie: "superadmin_session_id",
//   },
// ];
// const roleRedirect: Record<string, string> = {
//   user: "/register",
//   admin: "/dashboard",
//   superadmin: "/superadmin/*",
// };
// export async function POST(req: NextRequest) {
//   const { username, password } = await req.json();
//   const user = users.find(
//     (u) => u.username === username && u.password === password,
//   );
//   if (!user) {
//     return NextResponse.json(
//       { message: "Invalid credentials" },
//       { status: 401 },
//     );
//   }
//   // 1h30m = 5400 seconds
//   const res = NextResponse.json({
//     success: true,
//     redirect: roleRedirect[user.role],
//   });
//   // Clear all possible role cookies before setting the new one
//   const allRoleCookies = [
//     "user_session_id",
//     "admin_session_id",
//     "superadmin_session_id",
//   ];
//   for (const cookieName of allRoleCookies) {
//     res.cookies.set(cookieName, "", {
//       httpOnly: true,
//       maxAge: 0,
//       path: "/",
//       sameSite: "lax",
//     });
//   }
//   // Set the new session cookie for the logged-in user
//   res.cookies.set(user.cookie, Math.random().toString(36).slice(2), {
//     httpOnly: true,
//     maxAge: 5400,
//     path: "/",
//     sameSite: "lax",
//   });
//   return res;
// }
// AUTH DISABLED: No authentication is currently active.
export async function POST() {
  return new Response(
    JSON.stringify({ message: "Authentication is currently disabled." }),
    {
      status: 503,
      headers: { "Content-Type": "application/json" },
    },
  );
}
