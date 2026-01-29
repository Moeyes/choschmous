"use client"

import { useState } from "react"
import { SportsSection } from "../components/SportsSection"
import type { DashboardSport } from "../types"

const SAMPLE_SPORTS: DashboardSport[] = [
  { id: "s1", name: "Basketball", category: "Team Sports", participants: 144, status: "Completed" },
  { id: "s2", name: "Swimming", category: "Aquatics", participants: 96, status: "Ongoing" },
  { id: "s3", name: "Athletics", category: "Track & Field", participants: 128, status: "Ongoing" },
]

type SportsPageProps = {
  sports?: DashboardSport[]
  onCreateSport?: () => void
  onEditSport?: (sport: DashboardSport) => void
  onDeleteSport?: (id: string) => void
}

export function SportsPage({
  sports = SAMPLE_SPORTS,
  onCreateSport,
  onEditSport,
  onDeleteSport,
}: SportsPageProps) {
  const [sportsList, setSportsList] = useState<DashboardSport[]>(sports)

  const handleDelete = (id: string) => {
    setSportsList((prev) => prev.filter((s) => s.id !== id))
    onDeleteSport?.(id)
  }

  return (
    <div className="p-6">
      <SportsSection 
        sports={sportsList}
        onCreateSport={onCreateSport}
        onEditSport={onEditSport}
        onDeleteSport={handleDelete}
      />
    </div>
  )
}

export default SportsPage
