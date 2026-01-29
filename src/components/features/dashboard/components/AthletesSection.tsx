"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Eye, Pencil, Trash2, User, Plus } from "lucide-react"
import type { DashboardAthlete } from "../types"
import { useMemo, useState, useEffect } from "react"
import SectionHeader from "./SectionHeader"
import StatsGrid from "./StatsGrid"

type AthleteSectionProps = {
  athletes: DashboardAthlete[]
  onViewAthlete?: (athlete: DashboardAthlete) => void
  onEditAthlete?: (athlete: DashboardAthlete) => void
  onDeleteAthlete?: (id: string) => void
  onCreateAthlete?: () => void
}

export function AthletesSection({ 
  athletes, 
  onViewAthlete, 
  onEditAthlete, 
  onDeleteAthlete, 
  onCreateAthlete 
}: AthleteSectionProps) {
  const [list, setList] = useState<DashboardAthlete[]>(athletes)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [provinceFilter, setProvinceFilter] = useState<string>("all")

  useEffect(() => {
    setList(athletes)
  }, [athletes])

  const stats = useMemo(() => {
    const total = list.length
    const approved = list.filter((a) => a.status?.toLowerCase() === "approved").length
    const pending = list.filter((a) => a.status?.toLowerCase() === "pending").length
    const rejected = list.filter((a) => a.status?.toLowerCase() === "rejected").length
    return { total, approved, pending, rejected }
  }, [list])

  const provinces = useMemo(() => {
    return [...new Set(list.map((a) => a.province).filter(Boolean))]
  }, [list])

  const filteredList = useMemo(() => {
    return list.filter((athlete) => {
      const matchesSearch = !searchQuery || 
        athlete.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.firstNameKh?.includes(searchQuery) ||
        athlete.lastNameKh?.includes(searchQuery) ||
        athlete.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.organization?.name?.includes(searchQuery)
      const matchesStatus = statusFilter === "all" || athlete.status?.toLowerCase() === statusFilter.toLowerCase()
      const matchesProvince = provinceFilter === "all" || athlete.province === provinceFilter
      return matchesSearch && matchesStatus && matchesProvince
    })
  }, [list, searchQuery, statusFilter, provinceFilter])

  const getStatusBadgeColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "rejected":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<User className="h-6 w-6 text-slate-600" />}
        title="គ្រប់គ្រងអ្នកចូលរួម"
        subtitle="គ្រប់គ្រងការចុះឈ្មោះ និងប្រវត្តិរូបរបស់អ្នកចូលរួម"
        actions={
          <Button 
            onClick={onCreateAthlete}
            className="bg-[#1a4cd8] hover:bg-blue-700 rounded-xl gap-2 h-11"
          >
            <Plus className="h-4 w-4" />
            បន្ថែមអ្នកចូលរួម
          </Button>
        }
      />

      <StatsGrid
        items={[
          { label: "សរុប", value: String(stats.total), color: "bg-blue-100" },
          { label: "អនុម័ត", value: String(stats.approved), color: "bg-green-100" },
          { label: "កំពុងរងចាំ", value: String(stats.pending), color: "bg-yellow-100" },
          { label: "បដិសេធ", value: String(stats.rejected), color: "bg-red-100" },
        ]}
      />

      <Card className="border-none shadow-sm rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="ស្វែងរកអ្នកចូលរួម..." 
              className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ស្ថានភាពទាំងអស់</option>
            <option value="approved">អនុម័ត</option>
            <option value="pending">កំពុងរងចាំ</option>
            <option value="rejected">បដិសេធ</option>
          </select>
          <select 
            className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium"
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
          >
            <option value="all">ខេត្តទាំងអស់</option>
            {provinces.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">បញ្ជីអ្នកចូលរួម ({filteredList.length})</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">ឈ្មោះ</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">តំណាង</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">កីឡា</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">ស្ថានភាព</TableHead>
                <TableHead className="font-bold text-[10px] uppercase text-slate-400">សកម្មភាព</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.map((athlete) => (
                <TableRow key={athlete.id} className="group transition-colors">
                  <TableCell className="font-bold text-slate-700">
                    {athlete.firstNameKh && athlete.lastNameKh 
                      ? `${athlete.firstNameKh} ${athlete.lastNameKh}`
                      : athlete.name}
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium">{athlete.organization?.name || athlete.province}</TableCell>
                  <TableCell className="text-slate-500 font-medium">{athlete.sport}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadgeColor(athlete.status)} text-white border-none rounded-lg px-3 py-1 text-[10px]`}>
                      {athlete.status === "approved" ? "អនុម័ត" : athlete.status === "pending" ? "កំពុងរងចាំ" : athlete.status === "rejected" ? "បដិសេធ" : athlete.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg bg-slate-50 hover:bg-slate-100"
                        onClick={() => onViewAthlete?.(athlete)}
                      >
                        <Eye className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg bg-slate-50 hover:bg-slate-100"
                        onClick={() => onEditAthlete?.(athlete)}
                      >
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg bg-slate-50 hover:bg-slate-100"
                        onClick={() => onDeleteAthlete?.(athlete.id)}
                      >
                        <Trash2 className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    គ្មានអ្នកចូលរួមទេ
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

export default AthletesSection
