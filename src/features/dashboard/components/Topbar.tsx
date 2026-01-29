"use client"

import React from "react"
import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Topbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 bg-slate-50 border-none h-10 rounded-xl" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-full hover:bg-slate-50 transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">Admin User</p>
            <p className="text-[10px] text-muted-foreground">Administrator</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-[#1a4cd8] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
