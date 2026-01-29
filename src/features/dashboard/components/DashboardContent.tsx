"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { DashboardBanner } from "./Banner"
import StatsGrid from "./StatsGrid"
import { EventsSection } from "./EventsSection"
import { QuickActions } from "./QuickActions"
import { ParticipantsSection } from "./ParticipantsSection"
import { SportsSection } from "./SportsSection"
import { ProvincesSection } from "./ProvincesSection"

import type { 
  DashboardParticipant,
  DashboardEvent, 
  DashboardSport, 
  DashboardProvince, 
  DashboardStats 
} from "./types"

type DashboardContentProps = {
  // Data props - can be passed in or use defaults
  events?: DashboardEvent[]
  participants?: DashboardParticipant[]
  athletes?: DashboardParticipant[] // Kept for backward compatibility with prop passing
  sports?: DashboardSport[]
  provinces?: DashboardProvince[]
  
  // Initial view
  initialView?: string
  
  // Callbacks
  onEventSelect?: (eventId: string | null) => void
  onViewChange?: (view: string) => void
}

export function DashboardContent({
  events: initialEvents = [],
  participants: initialParticipants,
  athletes: initialAthletes = [],
  sports: initialSports = [],
  provinces: initialProvinces = [],
  initialView = "dashboard",
  onEventSelect,
  onViewChange,
}: DashboardContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const eventIdFromUrl = searchParams?.get("event") ?? null
  const currentView = searchParams?.get("view") || initialView

  const [events, setEvents] = useState<DashboardEvent[]>(initialEvents)
  const [participants, setParticipants] = useState<DashboardParticipant[]>(initialParticipants || initialAthletes)
  const [sports, setSports] = useState<DashboardSport[]>(initialSports)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(eventIdFromUrl)

  useEffect(() => {
    setSelectedEventId(eventIdFromUrl)
  }, [eventIdFromUrl])

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])

  useEffect(() => {
    setParticipants(initialParticipants || initialAthletes)
  }, [initialParticipants, initialAthletes])

  useEffect(() => {
    setSports(initialSports)
  }, [initialSports])

  const currentParticipants = useMemo(() => {
    if (selectedEventId) {
      return participants.filter((p) => p.eventId === selectedEventId)
    }
    return participants
  }, [participants, selectedEventId])

  const provinceStats = useMemo((): DashboardProvince[] => {
    if (initialProvinces.length > 0) return initialProvinces

    const provincesMap: Record<string, DashboardProvince> = {}
    currentParticipants.forEach((p) => {
      const key = p.province || "Unknown"
      if (!provincesMap[key]) {
        provincesMap[key] = { name: key, participants: 0, total: 0 }
      }
      provincesMap[key].participants += 1
      provincesMap[key].total = provincesMap[key].participants
    })
    return Object.values(provincesMap).sort((a, b) => b.participants - a.participants)
  }, [currentParticipants, initialProvinces])

  const stats: DashboardStats = useMemo(() => ({
    participants: participants.length,
    sports: sports.length,
    provinces: provinceStats.length,
    events: events.length,
  }), [participants, sports, provinceStats, events])

  const handleSelectEvent = (id: string | null) => {
    if (id) {
      router?.push?.(`/?event=${id}&view=dashboard`)
    } else {
      router?.push?.("/")
    }
    setSelectedEventId(id)
    onEventSelect?.(id)
  }

  const handleCreateEvent = (event: DashboardEvent) => {
    setEvents((prev) => [event, ...prev])
  }

  const statsItems = [
    { label: "អ្នកចorg រorg ម", value: stats.participants },
    { label: "កorg ឡorg ", value: stats.sports },
    { label: "ខorg ត្ត/ក្រorg ង", value: stats.provinces },
  ]

  return (
    <div className="space-y-8">
        {(currentView === "dashboard" || !currentView) && (
          <>
            <DashboardBanner />
            <StatsGrid items={statsItems} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <EventsSection
                  events={events}
                  onCreate={handleCreateEvent}
                  onSelect={handleSelectEvent}
                />
              </div>
              <div className="space-y-6">
                <QuickActions />
              </div>
            </div>
          </>
        )}

        {currentView === "participants" && (
          <ParticipantsSection athletes={currentParticipants} />
        )}

        {currentView === "sports" && (
          <SportsSection sports={sports} />
        )}

        {currentView === "provinces" && (
          <ProvincesSection provinces={provinceStats} />
        )}

    </div>
  )
}

export default DashboardContent
