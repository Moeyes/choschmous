"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  MapPin,
  Settings,
  UserPlus,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dropDownDashboard, dropDownItems, dropDownRegister } from "../sidebar/sideBar";

interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: { label: string; href: string }[];
}

export function Sidebar({ mode = "admin" }: { mode?: "admin" | "superadmin" }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const base = mode === "superadmin" ? "/superadmin" : "/dashboard";

  const items: SidebarItem[] = [
    {
      label: "ផ្ទាំងគ្រប់គ្រង",
      icon: <LayoutDashboard className="h-5 w-5" />,
      children: dropDownItems(dropDownDashboard.slice()),
    },
    {
      label: "អ្នកចូលរួម",
      icon: <Users className="h-5 w-5" />,
      href: `${base}/participants`,
    },
    {
      label: "ព្រឹត្តិការណ៍",
      icon: <Calendar className="h-5 w-5" />,
      href: `${base}/events`,
    },
    {
      label: "កីឡា",
      icon: <Trophy className="h-5 w-5" />,
      href: `${base}/sports`,
    },
    {
      label: "ខេត្ត/ក្រុង",
      icon: <MapPin className="h-5 w-5" />,
      href: `${base}/provinces`,
    },
    {
      label: "ចុះបញ្ជី",
      icon: <UserPlus className="h-5 w-5" />,
      children: dropDownItems(dropDownRegister.slice()),
    },
  ];

  // Auto-open dropdown if child route is active
  React.useEffect(() => {
    const registerItem = items.find((item) => item.label === "ចុះបញ្ជី");
    if (
      registerItem?.children?.some((child) => pathname?.startsWith(child.href))
    ) {
      setOpenDropdown("ចុះបញ្ជី");
    } else {
      setOpenDropdown(null);
    }
  }, [pathname]);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
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
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== base && pathname?.startsWith(item.href || ""));

          const isDropdown = item.children && item.children.length > 0;
          const isOpen = openDropdown === item.label;

          if (isDropdown) {
            return (
              <div key={item.label} className="relative">
                {/* Dropdown Button */}
                <button
                  onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isOpen
                      ? "bg-[#1a4cd8] text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>

                  <svg
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isOpen && "rotate-180",
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-4 py-2 text-sm rounded-lg transition",
                            isChildActive
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-slate-600 hover:bg-slate-100",
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href || "#"}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-[#1a4cd8] text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <Link
          href={`${base}?view=settings`}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">ការកំណត់</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
