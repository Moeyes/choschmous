// Utility to get user role from cookies (client-side)
export function getUserRole(): "superadmin" | "admin" | "user" | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  if (cookies.find((c) => c.startsWith("superadmin_session_id=")))
    return "superadmin";
  if (cookies.find((c) => c.startsWith("admin_session_id="))) return "admin";
  if (cookies.find((c) => c.startsWith("user_session_id="))) return "user";
  return null;
}
