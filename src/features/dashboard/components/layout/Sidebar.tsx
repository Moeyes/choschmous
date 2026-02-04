"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Trophy, 
  MapPin,
  Settings,
  UserPlus,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItem {
  label: string
  icon: React.ReactNode
  href: string
}

const sidebarItems: SidebarItem[] = [
  {
    label: "ផ្ទាំងគ្រប់គ្រង",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    label: "អ្នកចូលរួម",
    icon: <Users className="h-5 w-5" />,
    href: "/dashboard/participants",
  },
  {
    label: "ព្រឹត្តិការណ៍",
    icon: <Calendar className="h-5 w-5" />,
    href: "/dashboard/events",
  },
  {
    label: "កីឡា",
    icon: <Trophy className="h-5 w-5" />,
    href: "/dashboard/sports",
  },
  {
    label: "ខេត្ត/ក្រុង",
    icon: <MapPin className="h-5 w-5" />,
    href: "/dashboard/provinces",
  },
  {
    label: "ចុះឈ្មោះ",
    icon: <UserPlus className="h-5 w-5" />,
    href: "/register",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Logo/Brand */}
      <div className="h-16 border-b border-slate-200 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#1a4cd8] flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">ប័ណ្ណកីឡា</h1>
            <p className="text-xs text-muted-foreground">ការគ្រប់គ្រង</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname?.startsWith(item.href))
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-[#1a4cd8] text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <Link
          href="/dashboard?view=settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">ការកំណត់</span>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
