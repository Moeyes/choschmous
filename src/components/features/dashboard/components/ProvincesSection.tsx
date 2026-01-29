"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, MapPin } from "lucide-react"
import { useMemo, useState } from "react"
import SectionHeader from "./SectionHeader"
import StatsGrid from "./StatsGrid"

export type Province = {
  name: string
  gold: number
  silver: number
  bronze: number
  athletes: number
  total: number
}

type ProvincesSectionProps = {
  provinces: Province[]
  onCreateProvince?: () => void
}

export function ProvincesSection({ provinces, onCreateProvince }: ProvincesSectionProps) {
  const [list, setList] = useState<Province[]>(provinces)

  const stats = useMemo(() => {
    const totalProvinces = list.length
    const totalAthletes = list.reduce((s, p) => s + p.athletes, 0)
    const totalMedals = list.reduce((s, p) => s + p.total, 0)
    const avgMedals = (totalMedals / Math.max(1, list.length)).toFixed(1)
    return { totalProvinces, totalAthletes, totalMedals, avgMedals }
  }, [list])

  const topProvince = useMemo(() => {
    if (list.length === 0) return null
    return [...list].sort((a, b) => b.total - a.total)[0]
  }, [list])

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<MapPin className="h-6 w-6 text-slate-400" />}
        title="Province Statistics"
        subtitle="View province rankings and performance"
        actions={
          <>
            <button className="h-11 px-4 rounded-xl border border-blue-600 text-blue-600 font-medium">
              Export
            </button>
            <button 
              onClick={onCreateProvince}
              className="bg-[#1a4cd8] hover:bg-blue-700 rounded-xl gap-2 h-11 inline-flex items-center px-4 text-white font-medium"
            >
              <Plus className="h-4 w-4" /> <span>Add Province</span>
            </button>
          </>
        }
      />

      <StatsGrid
        items={[
          { label: "Total Provinces", value: String(stats.totalProvinces), color: "bg-blue-100" },
          { label: "Total Athletes", value: String(stats.totalAthletes), color: "bg-green-100" },
          { label: "Total Medals", value: String(stats.totalMedals), color: "bg-purple-100" },
          { label: "Avg Medals/Province", value: String(stats.avgMedals), color: "bg-orange-100" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Province Card */}
        {topProvince && (
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden relative p-8 h-full bg-white">
            <div className="flex flex-col h-full justify-center space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-slate-800">#1</span>
                <div className="bg-yellow-100 p-2 rounded-xl">
                  <svg className="h-8 w-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">{topProvince.name}</h3>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Athletes:</span>
                  <span className="text-xl font-black">{topProvince.athletes}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-sm">🥇 {topProvince.gold}</span>
                  <span className="text-sm">🥈 {topProvince.silver}</span>
                  <span className="text-sm">🥉 {topProvince.bronze}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-slate-500 font-bold">Total Medals:</span>
                  <span className="text-4xl font-black text-[#1a4cd8]">{topProvince.total}</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-12 -mt-12 blur-2xl" />
          </Card>
        )}

        {/* Province Table */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Rank</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Province</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Gold</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Silver</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Bronze</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Total</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">Athletes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...list].sort((a, b) => b.total - a.total).map((province, index) => (
                <TableRow key={province.name} className="group transition-colors">
                  <TableCell className="font-bold text-slate-700">#{index + 1}</TableCell>
                  <TableCell className="font-bold text-slate-700">{province.name}</TableCell>
                  <TableCell className="text-yellow-600 font-medium">{province.gold}</TableCell>
                  <TableCell className="text-slate-400 font-medium">{province.silver}</TableCell>
                  <TableCell className="text-amber-700 font-medium">{province.bronze}</TableCell>
                  <TableCell className="font-bold text-[#1a4cd8]">{province.total}</TableCell>
                  <TableCell className="text-slate-500 font-medium">{province.athletes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

export default ProvincesSection
