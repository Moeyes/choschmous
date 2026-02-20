"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardLayout({
  children,
  mode = "admin",
}: {
  children: React.ReactNode;
  mode?: "admin" | "superadmin";
}) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar mode={mode} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar mode={mode} />
        <main className="p-6 flex-1 overflow-auto bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
