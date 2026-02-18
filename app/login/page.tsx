// =====================
// AUTH DISABLED
// The following authentication logic is commented out for maintenance or disabling auth.
// import LoginPage from "@/features/auth/LoginPage";
// export default function Page() {
//   return <LoginPage />;
// }
// AUTH DISABLED: No authentication is currently active.
export default function Page() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "4rem",
        fontSize: "1.5rem",
        color: "#888",
      }}
    >
      Authentication is currently disabled.
    </div>
  );
}
