"use client"

import { useState } from "react"
import { ProvincesSection } from "../components/ProvincesSection"
import type { DashboardProvince, DashboardAthlete } from "../types"

const SAMPLE_ATHLETES: DashboardAthlete[] = [
  { id: "a1", name: "Sokha Mean", province: "Phnom Penh", sport: "Boxing", status: "Approved", medals: { gold: 1, silver: 0, bronze: 0 } },
  { id: "a2", name: "Dara Van", province: "Siem Reap", sport: "Badminton", status: "Approved", medals: { gold: 0, silver: 1, bronze: 0 } },
  { id: "a3", name: "Sopheap Kim", province: "Phnom Penh", sport: "Swimming", status: "Approved", medals: { gold: 0, silver: 0, bronze: 1 } },
]

function calcProvinces(athletes: DashboardAthlete[]): DashboardProvince[] {
  const provinces: Record<string, DashboardProvince> = {}
  athletes.forEach((a) => {
    const key = a.province || "Unknown"
    if (!provinces[key]) {
      provinces[key] = { name: key, gold: 0, silver: 0, bronze: 0, athletes: 0, total: 0 }
    }
    const medals = a.medals ?? { gold: 0, silver: 0, bronze: 0 }
    provinces[key].gold += medals.gold
    provinces[key].silver += medals.silver
    provinces[key].bronze += medals.bronze
    provinces[key].athletes += 1
    provinces[key].total = provinces[key].gold + provinces[key].silver + provinces[key].bronze
  })
  return Object.values(provinces)
}

type ProvincesPageProps = {
  athletes?: DashboardAthlete[]
  provinces?: DashboardProvince[]
  onCreateProvince?: () => void
}

export function ProvincesPage({
  athletes = SAMPLE_ATHLETES,
  provinces: initialProvinces,
  onCreateProvince,
}: ProvincesPageProps) {
  const provinces = initialProvinces ?? calcProvinces(athletes)

  return (
    <div className="p-6">
      <ProvincesSection 
        provinces={provinces}
        onCreateProvince={onCreateProvince}
      />
    </div>
  )
}

export default ProvincesPage
