"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Phone, Calendar, MapPin, User, Trophy } from "lucide-react"
import { ParticipantAvatar, StatusBadge } from "@/src/shared/components"
import { Grid } from "@/src/shared/utils/patterns"
import { formatDateToDDMMYYYYKhmer } from "@/src/lib/khmer"
import { getGenderDisplay, getRoleDisplay } from "@/src/lib/display"
import type { DashboardAthlete } from "./../types"
import type { ReactNode } from "react"

interface ParticipantDetailDialogProps {
  participant: DashboardAthlete | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (participant: DashboardAthlete) => void
}

function DetailItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-slate-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-400 uppercase font-medium">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  )
}

export function ParticipantDetailDialog({ participant, open, onOpenChange, onEdit }: ParticipantDetailDialogProps) {
  if (!participant) return null

  const displayName = participant.fullNameKhmer || participant.name || ""
  const formattedDob = participant.dateOfBirth ? formatDateToDDMMYYYYKhmer(new Date(participant.dateOfBirth)) : ""
  const formattedRegisteredAt = participant.registeredAt ? formatDateToDDMMYYYYKhmer(new Date(participant.registeredAt)) : ""
  const orgDisplay = participant.organization?.name || participant.province || ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex-row items-start justify-between space-y-0">
          <DialogTitle className="text-lg font-bold">ព័ត៌មានអ្នកចូលរួម</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <ParticipantAvatar photoUrl={participant.photoUrl} name={participant.name} size="lg" />
            <div>
              <h3 className="text-xl font-bold text-slate-800">{displayName}</h3>
              <p className="text-sm text-slate-500">
                {getRoleDisplay(participant.position?.role)} • {getGenderDisplay(participant.gender)}
              </p>
              <StatusBadge status={participant.status} className="mt-1" />
            </div>
          </div>

          <Grid cols={2} gap={4}>
            <DetailItem icon={<Phone className="h-4 w-4" />} label="ទូរស័ព្ទ" value={participant.phone || "-"} />
            <DetailItem icon={<Calendar className="h-4 w-4" />} label="ថ្ងៃកំណើត" value={formattedDob || "-"} />
            <DetailItem icon={<MapPin className="h-4 w-4" />} label="ខេត្ត/ក្រុង" value={orgDisplay || "-"} />
            <DetailItem icon={<Trophy className="h-4 w-4" />} label="កីឡា" value={participant.sport || "-"} />
            <DetailItem icon={<User className="h-4 w-4" />} label="ប្រភេទ" value={participant.sportCategory || "-"} />
            <DetailItem icon={<Calendar className="h-4 w-4" />} label="ថ្ងៃចុះឈ្មោះ" value={formattedRegisteredAt || "-"} />
          </Grid>

          {participant.nationalID && (
            <div className="pt-4 border-t">
              <p className="text-xs text-slate-400 uppercase font-medium mb-1">អត្តសញ្ញាណប័ណ្ណ</p>
              <p className="text-sm font-medium text-slate-700">{participant.nationalID}</p>
            </div>
          )}
        </div>

        {onEdit && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>បិទ</Button>
            <Button
              onClick={() => {
                onEdit(participant)
                onOpenChange(false)
              }}
              className="bg-[#1a4cd8] hover:bg-blue-700"
            >
              កែសម្រួល
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ParticipantDetailDialog
