"use client"

import { Card } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { User, Plus } from "lucide-react"
import type { DashboardAthlete } from "./types"
import { useMemo, useState, useEffect } from "react"
import SectionHeader from "./SectionHeader"
import StatsGrid from "./StatsGrid"
import { ParticipantDetailDialog } from "./ParticipantDetailDialog"
import { ParticipantEditDialog } from "./ParticipantEditDialog"
import { SearchInput, FilterDropdown, StatusBadge, EmptyState, ActionButtons, ParticipantAvatar } from "@/src/shared/components"
import { formatDateToDDMMYYYYKhmer } from "@/src/lib/khmer"

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
  
  // Dialog states
  const [selectedAthlete, setSelectedAthlete] = useState<DashboardAthlete | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    setList(athletes)
  }, [athletes])

  const handleView = (athlete: DashboardAthlete) => {
    setSelectedAthlete(athlete)
    setViewDialogOpen(true)
    onViewAthlete?.(athlete)
  }

  const handleEdit = (athlete: DashboardAthlete) => {
    setSelectedAthlete(athlete)
    setEditDialogOpen(true)
    onEditAthlete?.(athlete)
  }

  const handleSaveEdit = (updatedAthlete: DashboardAthlete) => {
    setList(prev => prev.map(a => a.id === updatedAthlete.id ? updatedAthlete : a))
    setEditDialogOpen(false)
    setSelectedAthlete(null)
  }

  const handleOpenEditFromView = () => {
    setViewDialogOpen(false)
    setEditDialogOpen(true)
  }

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

  // Build filter options
  const statusOptions = [
    { value: "all", label: "ស្ថានភាពទាំងអស់" },
    { value: "approved", label: "អនុម័ត" },
    { value: "pending", label: "កំពុងរងចាំ" },
    { value: "rejected", label: "បដិសេធ" },
  ]

  const provinceOptions = [
    { value: "all", label: "ខេត្តទាំងអស់" },
    ...provinces.map((p) => ({ value: p, label: p })),
  ]

  const filteredList = useMemo(() => {
    return list.filter((athlete) => {
      const matchesSearch = !searchQuery || 
        athlete.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.fullNameKhmer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.organization?.name?.includes(searchQuery)
      const matchesStatus = statusFilter === "all" || athlete.status?.toLowerCase() === statusFilter.toLowerCase()
      const matchesProvince = provinceFilter === "all" || athlete.province === provinceFilter
      return matchesSearch && matchesStatus && matchesProvince
    })
  }, [list, searchQuery, statusFilter, provinceFilter])

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
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="ស្វែងរកអ្នកចូលរួម..."
            className="flex-1 min-w-50"
          />
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
          />
          <FilterDropdown
            value={provinceFilter}
            onChange={setProvinceFilter}
            options={provinceOptions}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">បញ្ជីអ្នកចូលរួម ({filteredList.length})</h3>
          </div>
          
          {/* Card Grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredList.map((athlete) => {
              const displayName = athlete.fullNameKhmer || athlete.name
              const role = typeof athlete.position === "string" 
                ? athlete.position 
                : athlete.position?.role || "អត្តពលិកម្ម"
              const formattedDob = athlete.dateOfBirth
                ? formatDateToDDMMYYYYKhmer(new Date(athlete.dateOfBirth))
                : ""
              
              return (
                <Card 
                  key={athlete.id} 
                  className="relative bg-white dark:bg-card border-none shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  {/* Status Badge - Top Right */}
                  <StatusBadge 
                    status={athlete.status} 
                    className="absolute top-4 right-4 rounded-lg px-3 py-1 text-[10px]" 
                  />

                  {/* Header: Avatar + Name */}
                  <div className="flex items-start gap-3 mb-4">
                    {/* Avatar */}
                    <ParticipantAvatar 
                      photoUrl={athlete.photoUrl}
                      name={displayName}
                      size="lg"
                    />
                    
                    {/* Name & Organization */}
                    <div className="flex-1 min-w-0 pr-16">
                      <h4 className="font-bold text-blue-600 text-sm truncate">
                        {displayName}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {athlete.organization?.name || athlete.province}
                      </p>
                    </div>
                  </div>

                  {/* Info Row: Sport Badge + Role */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 rounded-md text-[10px] px-2 py-0.5">
                      កីឡា
                    </Badge>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-600">{role}</span>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <span>ថ្ងៃ</span>
                    <span>•</span>
                    <span>{formattedDob || "—"}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <ActionButtons
                      onView={() => handleView(athlete)}
                      onEdit={() => handleEdit(athlete)}
                      onDelete={() => onDeleteAthlete?.(athlete.id)}
                      className="w-full justify-between"
                    />
                  </div>
                </Card>
              )
            })}
          </div>

          {filteredList.length === 0 && (
            <EmptyState type="participants" />
          )}
        </div>
      </Card>

      {/* View Dialog */}
      <ParticipantDetailDialog
        participant={selectedAthlete}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onEdit={handleOpenEditFromView}
      />

      {/* Edit Dialog */}
      <ParticipantEditDialog
        participant={selectedAthlete}
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false)
          setSelectedAthlete(null)
        }}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

export default AthletesSection
