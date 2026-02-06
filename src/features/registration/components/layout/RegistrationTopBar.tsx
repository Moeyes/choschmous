"use client";

import { Calendar, Home, LogOut } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { ROUTES } from "@/src/config/constants";

export function RegistrationTopBar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              ចុះឈ្មោះចូលរួមកីឡាជាតិ
            </h1>
            <p className="text-xs text-slate-500">ប្រព័ន្ធចុះឈ្មោះអ្នកចូលរួម</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href={ROUTES.home}>
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              ទំព័រដើម
            </Button>
          </Link>
          <Badge variant="outline" className="px-3 py-1">
            អ្នកចូលរួម
          </Badge>
        </div>
      </div>
    </header>
  );
}
