"use client"

import { Suspense } from "react"
import { DashboardPage, DashboardLayout } from "@/components/features/dashboard"

export default function Page() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8">Loading dashboard...</div>}>
        <DashboardPage />
      </Suspense>
    </DashboardLayout>
  )
}
