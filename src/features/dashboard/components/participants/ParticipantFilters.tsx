"use client"

import { SearchInput, FilterDropdown } from "@/src/shared/components"
import { cn } from "@/src/lib/utils"

interface ParticipantFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  positionFilter: string
  onPositionChange: (value: string) => void
  className?: string
}

const STATUS_OPTIONS = [
  { value: "all", label: "ស្ថានភាពទាំងអស់" },
  { value: "approved", label: "អនុម័ត" },
  { value: "pending", label: "កំពុងរង់ចាំ" },
  { value: "rejected", label: "បដិសេធ" },
]

const POSITION_OPTIONS = [
  { value: "all", label: "មុខតំណែងទាំងអស់" },
  { value: "Athlete", label: "អត្តពលិក" },
  { value: "Coach", label: "គ្រូបង្វឹក" },
  { value: "Leader", label: "ប្រធាន" },
  { value: "Official", label: "មន្រ្តី" },
]

export function ParticipantFilters({ 
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  positionFilter,
  onPositionChange,
  className 
}: ParticipantFiltersProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="ស្វែងរកឈ្មោះ, ខេត្ត, កីឡា..."
        className="flex-1"
      />
      <div className="flex gap-3">
        <FilterDropdown
          value={statusFilter}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
        />
        <FilterDropdown
          value={positionFilter}
          onChange={onPositionChange}
          options={POSITION_OPTIONS}
        />
      </div>
    </div>
  )
}

export default ParticipantFilters
