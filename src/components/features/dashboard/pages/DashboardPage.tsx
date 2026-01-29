"use client"

import { Suspense } from "react"
import { DashboardContent } from "../DashboardContent"
import { useDashboardData } from "@/hooks/useDashboardData"

export function DashboardPage() {
  const { athletes, events, sports, isLoading } = useDashboardData()

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>
  }

  return (
    <Suspense fallback={<div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>}>
      <div className="p-2">
        <DashboardContent 
          events={events}
          athletes={athletes}
          sports={sports}
          medals={[]}
        />
      </div>
    </Suspense>
  )
}

export default DashboardPage
