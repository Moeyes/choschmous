"use client"

import { useState } from "react"
import { AthletesSection } from "../components/AthletesSection"
import type { DashboardAthlete } from "../types"

const SAMPLE_ATHLETES: DashboardAthlete[] = [
  { id: "a1", name: "Sokha Mean", province: "Phnom Penh", sport: "Boxing", status: "Approved", medals: { gold: 1, silver: 0, bronze: 0 } },
  { id: "a2", name: "Dara Van", province: "Siem Reap", sport: "Badminton", status: "Approved", medals: { gold: 0, silver: 1, bronze: 0 } },
  { id: "a3", name: "Sopheap Kim", province: "Battambang", sport: "Swimming", status: "Pending", medals: { gold: 0, silver: 0, bronze: 1 } },
]

type AthletesPageProps = {
  athletes?: DashboardAthlete[]
  onViewAthlete?: (athlete: DashboardAthlete) => void
  onEditAthlete?: (athlete: DashboardAthlete) => void
  onDeleteAthlete?: (id: string) => void
  onCreateAthlete?: () => void
}

export function AthletesPage({
  athletes = SAMPLE_ATHLETES,
  onViewAthlete,
  onEditAthlete,
  onDeleteAthlete,
  onCreateAthlete,
}: AthletesPageProps) {
  const [athleteList, setAthleteList] = useState<DashboardAthlete[]>(athletes)

  const handleDelete = (id: string) => {
    setAthleteList((prev) => prev.filter((a) => a.id !== id))
    onDeleteAthlete?.(id)
  }

  return (
    <div className="p-6">
      <AthletesSection 
        athletes={athleteList}
        onViewAthlete={onViewAthlete}
        onEditAthlete={onEditAthlete}
        onDeleteAthlete={handleDelete}
        onCreateAthlete={onCreateAthlete}
      />
    </div>
  )
}

export default AthletesPage
