"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { DashboardBanner } from "./components/Banner"
import StatsGrid from "./components/StatsGrid"
import { EventsSection } from "./components/EventsSection"
import { QuickActions } from "./components/QuickActions"
import { ParticipantsSection } from "./components/ParticipantsSection"
import { SportsSection } from "./components/SportsSection"
import { ProvincesSection } from "./components/ProvincesSection"

import type { 
  DashboardAthlete, 
  DashboardEvent, 
  DashboardSport, 
  DashboardProvince, 
  DashboardMedal,
  DashboardStats 
} from "./types"

type DashboardContentProps = {
  // Data props - can be passed in or use defaults
  events?: DashboardEvent[]
  athletes?: DashboardAthlete[]
  sports?: DashboardSport[]
  medals?: DashboardMedal[]
  provinces?: DashboardProvince[]
  
  // Initial view
  initialView?: string
  
  // Callbacks
  onEventSelect?: (eventId: string | null) => void
  onViewChange?: (view: string) => void
}

export function DashboardContent({
  events: initialEvents = [],
  athletes: initialAthletes = [],
  sports: initialSports = [],
  medals: initialMedals = [],
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
  const [athletes, setAthletes] = useState<DashboardAthlete[]>(initialAthletes)
  const [sports, setSports] = useState<DashboardSport[]>(initialSports)
  const [medals, setMedals] = useState<DashboardMedal[]>(initialMedals)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(eventIdFromUrl)

  useEffect(() => {
    setSelectedEventId(eventIdFromUrl)
  }, [eventIdFromUrl])

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])

  useEffect(() => {
    setAthletes(initialAthletes)
  }, [initialAthletes])

  useEffect(() => {
    setSports(initialSports)
  }, [initialSports])

  useEffect(() => {
    setMedals(initialMedals)
  }, [initialMedals])

  const currentAthletes = useMemo(() => {
    if (selectedEventId) {
      return athletes.filter((a) => a.eventId === selectedEventId)
    }
    return athletes
  }, [athletes, selectedEventId])

  const provinceStats = useMemo((): DashboardProvince[] => {
    if (initialProvinces.length > 0) return initialProvinces

    const provincesMap: Record<string, DashboardProvince> = {}
    currentAthletes.forEach((a) => {
      const key = a.province || "Unknown"
      if (!provincesMap[key]) {
        provincesMap[key] = { name: key, gold: 0, silver: 0, bronze: 0, athletes: 0, total: 0 }
      }
      const medals = a.medals ?? { gold: 0, silver: 0, bronze: 0 }
      provincesMap[key].gold += medals.gold
      provincesMap[key].silver += medals.silver
      provincesMap[key].bronze += medals.bronze
      provincesMap[key].athletes += 1
      provincesMap[key].total = provincesMap[key].gold + provincesMap[key].silver + provincesMap[key].bronze
    })
    return Object.values(provincesMap)
  }, [currentAthletes, initialProvinces])

  const stats: DashboardStats = useMemo(() => ({
    athletes: athletes.length,
    sports: sports.length,
    provinces: provinceStats.length,
    medals: medals.length,
    events: events.length,
  }), [athletes, sports, provinceStats, medals, events])

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
    { label: "Athletes", value: stats.athletes },
    { label: "Sports", value: stats.sports },
    { label: "Provinces", value: stats.provinces },
    { label: "Medals", value: stats.medals },
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

        {currentView === "athletes" && (
          <ParticipantsSection athletes={currentAthletes} />
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
