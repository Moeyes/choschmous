// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { FaUser, FaLock } from "react-icons/fa";
// import Link from "next/link";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
// =====================
// AUTH DISABLED
// The following authentication logic is commented out for maintenance or disabling auth.
// =====================
// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//         credentials: "include", // Ensure cookies are set and sent
//     });
//     if (res.ok) {
//         const data = await res.json();
//         if (data.redirect) {
//             window.location.href = data.redirect;
//         } else {
//             window.location.reload();
//         }
//     } else {
//         const data = await res.json();
//         setError(data.message || "Login failed");
//     }
// };
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-reg-purple-50 via-reg-indigo-50 to-white px-2">
//       <div className="flex flex-col items-center mb-8 mt-8">
//         <div
//           className="text-2xl font-extrabold text-reg-slate-800"
//           style={{ fontFamily: "Noto Sans Khmer, Inter, sans-serif" }}
//         >
//           ចុះឈ្មោះ
//         </div>
//         <div className="uppercase text-xs tracking-widest text-reg-slate-500 font-semibold">
//           Registration System
//         </div>
//       </div>
//       <Card className="w-full max-w-md shadow-xl border-none">
//         <CardHeader className="text-center pb-2">
//           <CardTitle
//             className="text-2xl font-bold bg-linear-to-r from-reg-purple-700 via-reg-indigo-600 to-reg-purple-600 bg-clip-text text-transparent mb-1"
//             style={{ fontFamily: "Noto Sans Khmer, Inter, sans-serif" }}
//           >
//             ចូលប្រើប្រាស់
//           </CardTitle>
//           <div className="text-reg-slate-600 text-base font-medium">
//             សូមបញ្ចូលព័ត៌មានអ្នកប្រើប្រាស់ និងលេខសម្ងាត់
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <Label htmlFor="username" className="form-label">
//                 ឈ្មោះអ្នកប្រើប្រាស់ (Username)
//               </Label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-reg-indigo-600">
//                   <FaUser />
//                 </span>
//                 <Input
//                   id="username"
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                   className="pl-10"
//                   placeholder="ឈ្មោះអ្នកប្រើប្រាស់"
//                   autoComplete="username"
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between items-center">
//                 <Label htmlFor="password" className="form-label">
//                   លេខសម្ងាត់ (Password)
//                 </Label>
//                 <a
//                   href="#"
//                   className="text-sm text-reg-indigo-600 hover:underline transition"
//                 >
//                   ភ្លេចលេខសម្ងាត់?
//                 </a>
//               </div>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-reg-indigo-600">
//                   <FaLock />
//                 </span>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="pl-10"
//                   placeholder="លេខសម្ងាត់"
//                   autoComplete="current-password"
//                 />
//               </div>
//             </div>
//             {error && (
//               <div className="text-red-600 text-sm text-center font-medium">
//                 {error}
//               </div>
//             )}
//             <Button
//               type="submit"
//               className="w-full bg-linear-to-r from-reg-purple-700 via-reg-indigo-600 to-reg-purple-600 hover:from-reg-indigo-700 hover:to-reg-purple-700 shadow-md transition group"
//             >
//               ចូលប្រើប្រាស់
//               <span className="ml-2 group-hover:translate-x-1 transition-transform">
//                 →
//               </span>
//             </Button>
//           </form>
//           <div className="text-center mt-6 text-reg-slate-500 text-sm">
//             មិនទាន់មានគណនីទេ?{" "}
//             <Link
//               href="/register"
//               className="font-bold text-reg-purple-700 hover:underline"
//             >
//               ចុះឈ្មោះថ្មី
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//       <footer className="mt-8 text-center text-xs text-reg-slate-400 font-medium">
//         © 2026 SPORTS EVENT MANAGEMENT SYSTEM
//       </footer>
//     </div>
//   );
// }
