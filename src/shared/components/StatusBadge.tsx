"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/src/lib/utils"

type StatusType = "approved" | "pending" | "rejected" | "active" | "inactive" | "completed" | string

interface StatusBadgeProps {
  status?: StatusType
  className?: string
  showKhmer?: boolean
}

const STATUS_CONFIG: Record<string, { color: string; labelKh: string; labelEn: string }> = {
  approved: { color: "bg-emerald-500 hover:bg-emerald-600", labelKh: "អនុម័ត", labelEn: "Approved" },
  pending: { color: "bg-yellow-500 hover:bg-yellow-600", labelKh: "កំពុងរង់ចាំ", labelEn: "Pending" },
  rejected: { color: "bg-red-500 hover:bg-red-600", labelKh: "បដិសេធ", labelEn: "Rejected" },
  active: { color: "bg-emerald-500 hover:bg-emerald-600", labelKh: "សកម្ម", labelEn: "Active" },
  inactive: { color: "bg-slate-500 hover:bg-slate-600", labelKh: "អសកម្ម", labelEn: "Inactive" },
  completed: { color: "bg-blue-500 hover:bg-blue-600", labelKh: "បញ្ចប់", labelEn: "Completed" },
}

export function StatusBadge({ status, className, showKhmer = true }: StatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() || "pending"
  const config = STATUS_CONFIG[normalizedStatus] || { 
    color: "bg-slate-500 hover:bg-slate-600", 
    labelKh: status || "Unknown", 
    labelEn: status || "Unknown" 
  }

  return (
    <Badge 
      className={cn(
        "text-white border-none text-xs font-medium",
        config.color,
        className
      )}
    >
      {showKhmer ? config.labelKh : config.labelEn}
    </Badge>
  )
}

export function getStatusColor(status?: string): string {
  const normalizedStatus = status?.toLowerCase() || "pending"
  return STATUS_CONFIG[normalizedStatus]?.color || "bg-slate-500 hover:bg-slate-600"
}

export default StatusBadge
