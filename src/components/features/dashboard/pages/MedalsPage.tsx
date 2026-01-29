"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Medal, Plus, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { DashboardEvent, DashboardAthlete, DashboardMedal } from "../types"
import SectionHeader from "../components/SectionHeader"
import StatsGrid from "../components/StatsGrid"

const SAMPLE_EVENTS: DashboardEvent[] = [
  { id: "1", name: "32nd SEA GAMES", startDate: "2026-11-09", endDate: "2026-11-16", sports: ["Athletics"] },
  { id: "2", name: "National Youth Sports", startDate: "2026-12-01", endDate: "2026-12-10", sports: ["Ball Games"] },
]

const SAMPLE_ATHLETES: DashboardAthlete[] = [
  { id: "a1", name: "Sokha Mean", province: "Phnom Penh", sport: "Boxing", status: "Approved", medals: { gold: 1, silver: 0, bronze: 0 } },
  { id: "a2", name: "Dara Van", province: "Siem Reap", sport: "Badminton", status: "Approved", medals: { gold: 0, silver: 1, bronze: 0 } },
]

const SAMPLE_MEDALS: DashboardMedal[] = [
  { id: "m1", athleteId: "a1", athleteName: "Sokha Mean", eventId: "1", date: "2025-10-12", medalType: "Gold", sport: "Boxing", province: "Phnom Penh" },
  { id: "m2", athleteId: "a2", athleteName: "Dara Van", eventId: "1", date: "2025-10-13", medalType: "Silver", sport: "Badminton", province: "Siem Reap" },
]

type MedalsPageProps = {
  events?: DashboardEvent[]
  athletes?: DashboardAthlete[]
  medals?: DashboardMedal[]
  selectedEventId?: string | null
  onAddMedal?: () => void
}

export function MedalsPage({
  events = SAMPLE_EVENTS,
  athletes = SAMPLE_ATHLETES,
  medals: initialMedals = SAMPLE_MEDALS,
  selectedEventId,
  onAddMedal,
}: MedalsPageProps) {
  const [medals, setMedals] = useState<DashboardMedal[]>(initialMedals)

  const filteredMedals = selectedEventId
    ? medals.filter((m) => m.eventId === selectedEventId || m.event === selectedEventId)
    : medals

  const stats = {
    total: filteredMedals.length,
    gold: filteredMedals.filter((m) => m.medalType.toLowerCase() === "gold").length,
    silver: filteredMedals.filter((m) => m.medalType.toLowerCase() === "silver").length,
    bronze: filteredMedals.filter((m) => m.medalType.toLowerCase() === "bronze").length,
  }

  const getMedalBadgeColor = (medalType: string) => {
    switch (medalType.toLowerCase()) {
      case "gold":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "silver":
        return "bg-slate-400 hover:bg-slate-500"
      case "bronze":
        return "bg-amber-700 hover:bg-amber-800"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <SectionHeader
        icon={<Trophy className="h-6 w-6 text-yellow-500" />}
        title="Medals Management"
        subtitle="View and manage medal awards"
        actions={
          <Button 
            onClick={onAddMedal}
            className="bg-[#1a4cd8] hover:bg-blue-700 rounded-xl gap-2 h-11"
          >
            <Plus className="h-4 w-4" />
            Add Medal
          </Button>
        }
      />

      <StatsGrid
        items={[
          { label: "Total Medals", value: String(stats.total), color: "bg-purple-100" },
          { label: "Gold", value: String(stats.gold), color: "bg-yellow-100" },
          { label: "Silver", value: String(stats.silver), color: "bg-slate-100" },
          { label: "Bronze", value: String(stats.bronze), color: "bg-amber-100" },
        ]}
      />

      <Card className="border-none shadow-sm rounded-2xl p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">Athlete</TableHead>
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">Sport</TableHead>
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">Province</TableHead>
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">Medal</TableHead>
              <TableHead className="font-bold text-[10px] uppercase text-slate-400">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedals.map((medal) => (
              <TableRow key={medal.id} className="group transition-colors">
                <TableCell className="font-bold text-slate-700">{medal.athleteName}</TableCell>
                <TableCell className="text-slate-500 font-medium">{medal.sport || medal.sportName}</TableCell>
                <TableCell className="text-slate-500 font-medium">{medal.province}</TableCell>
                <TableCell>
                  <Badge className={`${getMedalBadgeColor(medal.medalType)} text-white border-none rounded-lg px-3 py-1 text-[10px]`}>
                    {medal.medalType}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 font-medium">{medal.date || medal.awardedDate}</TableCell>
              </TableRow>
            ))}
            {filteredMedals.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No medals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default MedalsPage
