"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react"
import { default as StatsGrid } from "@/src/features/dashboard/components/StatsGrid"
import { DataTable } from "@/src/shared/components/DataTable"
import { ParticipantTableRow } from "@/src/features/dashboard/components/ParticipantTableRow"
import type { DashboardEvent, DashboardParticipant } from "@/src/features/dashboard/types/types"

type Props = {
  params: Promise<{ id: string }>
}

export default function EventDetailPage({ params }: Props) {
  const router = useRouter()
  const [event, setEvent] = useState<DashboardEvent | null>(null)
  const [participants, setParticipants] = useState<DashboardParticipant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [eventId, setEventId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setEventId(p.id))
  }, [params])

  useEffect(() => {
    if (!eventId) return
    
    async function loadEventData() {
      try {
        const res = await fetch("/api/dashboard")
        const data = await res.json()
        const foundEvent = data.events?.find((e: DashboardEvent) => e.id === eventId)
        setEvent(foundEvent || null)
        setParticipants(data.participants || data.athletes || [])
      } catch (error) {
        console.error("Failed to load event:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadEventData()
  }, [eventId])

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "TBD"
    const date = new Date(dateStr)
    return date.toLocaleDateString("km-KH", { month: "long", day: "numeric", year: "numeric" })
  }

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>
  }

  if (!event) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/events")} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          ត្រឡប់ទៅព្រឹត្តិការណ៍
        </Button>
        <p className="text-muted-foreground">រកមិនឃើញព្រឹត្តិការណ៍</p>
      </div>
    )
  }

  // Calculate role distribution
  const roleStats = {
    athletes: participants.filter((p) => p.position?.role === "Athlete").length,
    coaches: participants.filter((p) => p.position?.role === "Coach").length,
    leaders: participants.filter((p) => p.position?.role === "Leader").length,
    officials: participants.filter((p) => p.position?.role === "Official").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.push("/dashboard/events")} className="gap-2 mb-4">
        <ArrowLeft className="h-4 w-4" />
        ត្រឡប់ទៅព្រឹត្តិការណ៍
      </Button>

      {/* Event Header */}
      <div className="bg-[#1a4cd8] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <div className="flex items-center gap-6 text-white/80">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
            {event.location && (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            {event.sports?.map((sport, i) => (
              <Badge 
                key={i} 
                className="bg-white/20 text-white border-white/30 rounded-lg"
              >
                {typeof sport === "string" ? sport : (sport as any)?.name ?? "កីឡា"}
              </Badge>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Stats */}
      <StatsGrid
        items={[
          { label: "អ្នកចូលរួម", value: participants.length, color: "bg-blue-100", icon: <Users className="h-5 w-5 text-blue-600" /> },
          { label: "កីឡាករ", value: roleStats.athletes, color: "bg-emerald-100", icon: <Users className="h-5 w-5 text-emerald-600" /> },
          { label: "គ្រូបង្វឹក", value: roleStats.coaches, color: "bg-purple-100", icon: <Users className="h-5 w-5 text-purple-600" /> },
          { label: "មេដឹកនាំ", value: roleStats.leaders, color: "bg-orange-100", icon: <Users className="h-5 w-5 text-orange-600" /> },
        ]}
      />

      {/* Participants Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">អ្នកចូលរួម ({participants.length})</h3>
        <DataTable
          columns={[
            { key: "name", header: "ឈ្មោះ" },
            { key: "province", header: "ខេត្ត/ក្រុង" },
            { key: "sport", header: "កីឡា" },
            { key: "role", header: "តួនាទី" },
            { key: "status", header: "ស្ថានភាព" },
          ]}
          data={participants.slice(0, 10)}
          renderRow={(participant, index) => (
            <ParticipantTableRow 
              key={participant.id}
              participant={participant}
              index={index}
            />
          )}
          emptyState={
            <Card className="border-none shadow-sm rounded-2xl p-6">
              <p className="text-center py-8 text-muted-foreground">
                មិនមានអ្នកចូលរួមចុះឈ្មោះ
              </p>
            </Card>
          }
        />
        {participants.length > 10 && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            និង {participants.length - 10} នាក់ទៀត...
          </p>
        )}
      </div>
    </div>
  )
}
