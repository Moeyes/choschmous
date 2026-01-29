"use client"

import React from "react"
import { Sidebar } from "./components/Sidebar"
import { Topbar } from "./components/Topbar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 flex-1 overflow-auto bg-slate-50">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
