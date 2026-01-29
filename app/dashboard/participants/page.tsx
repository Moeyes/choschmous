"use client"

import { useState, useEffect } from "react"
import { ParticipantsSection } from "@/src/features/dashboard/components"
import type { DashboardParticipant } from "@/src/features/dashboard/types/types"

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<DashboardParticipant[]>([])

  useEffect(() => {
    async function loadParticipants() {
      try {
        const res = await fetch("/api/dashboard")
        const data = await res.json()
        setParticipants(data.participants || [])
      } catch (error) {
        console.error("Failed to load participants:", error)
      }
    }
    loadParticipants()
  }, [])

  return (
    <div className="p-6">
      <ParticipantsSection
        athletes={participants}
        onViewAthlete={(participant) => console.log("View:", participant)}
        onEditAthlete={(participant) => console.log("Edit:", participant)}
        onDeleteAthlete={(id) => console.log("Delete:", id)}
        onCreateAthlete={() => console.log("Create new participant")}
      />
    </div>
  )
}
