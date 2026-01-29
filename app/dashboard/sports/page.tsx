"use client"

import { useState, useEffect } from "react"
import { SportsSection } from "@/src/features/dashboard/components"
import type { DashboardSport } from "@/src/features/dashboard/types/types"

export default function SportsPage() {
  const [sports, setSports] = useState<DashboardSport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSports() {
      try {
        const res = await fetch("/api/dashboard")
        const data = await res.json()
        setSports(data.sports || [])
      } catch (error) {
        console.error("Failed to load sports:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSports()
  }, [])

  const handleDelete = (id: string) => {
    setSports((prev) => prev.filter((s) => s.id !== id))
  }

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>
  }

  return (
    <div className="p-6">
      <SportsSection 
        sports={sports}
        onDeleteSport={handleDelete}
      />
    </div>
  )
}
