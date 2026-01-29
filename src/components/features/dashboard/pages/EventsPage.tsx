"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EventsSection } from "../components/EventsSection"
import type { DashboardEvent } from "../types"

const SAMPLE_EVENTS: DashboardEvent[] = [
  { id: "1", name: "32nd SEA GAMES", startDate: "2026-11-09", endDate: "2026-11-16", sports: ["Athletics", "Swimming", "Boxing"] },
  { id: "2", name: "National Youth Sports", startDate: "2026-12-01", endDate: "2026-12-10", sports: ["Ball Games", "Athletics"] },
]

type EventsPageProps = {
  events?: DashboardEvent[]
  onEventSelect?: (id: string | null) => void
  onEventCreate?: (event: DashboardEvent) => void
}

export function EventsPage({
  events: initialEvents = SAMPLE_EVENTS,
  onEventSelect,
  onEventCreate,
}: EventsPageProps) {
  const [events, setEvents] = useState<DashboardEvent[]>(initialEvents)
  const router = useRouter()

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])

  const handleSelect = (id: string | null) => {
    if (onEventSelect) {
      onEventSelect(id)
    } else if (id) {
      router?.push?.(`/events/${id}`)
    }
  }

  const handleCreate = (event: DashboardEvent) => {
    setEvents((prev) => [event, ...prev])
    onEventCreate?.(event)
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

export default EventsPage
