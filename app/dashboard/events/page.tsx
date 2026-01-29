"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EventsSection } from "@/src/features/dashboard/components"
import type { DashboardEvent } from "@/src/features/dashboard/types/types"

export default function EventsPage() {
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/dashboard")
        const data = await res.json()
        setEvents(data.events || [])
      } catch (error) {
        console.error("Failed to load events:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [])

  const handleSelect = (id: string | null) => {
    if (id) {
      router.push(`/dashboard/events/${id}`)
    }
  }

  const handleCreate = (event: DashboardEvent) => {
    setEvents((prev) => [event, ...prev])
  }

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>
  }

  return (
    <div className="p-6">
      <EventsSection 
        events={events} 
        onCreate={handleCreate} 
        onSelect={handleSelect} 
      />
    </div>
  )
}
