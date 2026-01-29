"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, MapPin, Trophy, Users, ArrowLeft } from "lucide-react"
import type { DashboardEvent, DashboardAthlete, DashboardMedal } from "../types"
import StatsGrid from "../components/StatsGrid"

type EventDetailPageProps = {
  event: DashboardEvent
  athletes?: DashboardAthlete[]
  medals?: DashboardMedal[]
  onBack?: () => void
}

export function EventDetailPage({
  event,
  athletes = [],
  medals = [],
  onBack,
}: EventDetailPageProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "TBD"
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const medalStats = {
    gold: medals.filter((m) => m.medalType.toLowerCase() === "gold").length,
    silver: medals.filter((m) => m.medalType.toLowerCase() === "silver").length,
    bronze: medals.filter((m) => m.medalType.toLowerCase() === "bronze").length,
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
      {/* Back button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Button>
      )}

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
                {typeof sport === "string" ? sport : (sport as any)?.name ?? "Sport"}
              </Badge>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Stats */}
      <StatsGrid
        items={[
          { label: "Athletes", value: athletes.length, color: "bg-blue-100", icon: <Users className="h-5 w-5 text-blue-600" /> },
          { label: "Gold Medals", value: medalStats.gold, color: "bg-yellow-100", icon: <Trophy className="h-5 w-5 text-yellow-600" /> },
          { label: "Silver Medals", value: medalStats.silver, color: "bg-slate-100", icon: <Trophy className="h-5 w-5 text-slate-500" /> },
          { label: "Bronze Medals", value: medalStats.bronze, color: "bg-amber-100", icon: <Trophy className="h-5 w-5 text-amber-700" /> },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Athletes Table */}
        <Card className="border-none shadow-sm rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Athletes ({athletes.length})</h3>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Name</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Province</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Sport</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes.slice(0, 5).map((athlete) => (
                <TableRow key={athlete.id}>
                  <TableCell className="font-medium">{athlete.name}</TableCell>
                  <TableCell className="text-slate-500">{athlete.province}</TableCell>
                  <TableCell className="text-slate-500">{athlete.sport}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500 text-white border-none rounded-lg text-[10px]">
                      {athlete.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {athletes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No athletes registered
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {athletes.length > 5 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              And {athletes.length - 5} more athletes...
            </p>
          )}
        </Card>

        {/* Medals Table */}
        <Card className="border-none shadow-sm rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Medals ({medals.length})</h3>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Athlete</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Sport</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Medal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medals.slice(0, 5).map((medal) => (
                <TableRow key={medal.id}>
                  <TableCell className="font-medium">{medal.athleteName}</TableCell>
                  <TableCell className="text-slate-500">{medal.sport || medal.sportName}</TableCell>
                  <TableCell>
                    <Badge className={`${getMedalBadgeColor(medal.medalType)} text-white border-none rounded-lg text-[10px]`}>
                      {medal.medalType}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {medals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    No medals awarded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {medals.length > 5 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              And {medals.length - 5} more medals...
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}

export default EventDetailPage
