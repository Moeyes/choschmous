"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import type { DashboardAthlete } from "../types";
import { ParticipantAvatar } from "@/src/shared/components";
import { StatusBadge, ActionButtons } from "@/src/shared/components";
import { formatDateToDDMMYYYYKhmer, toKhmerDigits } from "@/src/lib/khmer";

interface ParticipantTableRowProps {
  participant: DashboardAthlete;
  index: number;
  onView?: (participant: DashboardAthlete) => void;
  onEdit?: (participant: DashboardAthlete) => void;
  onDelete?: (id: string) => void;
}

export function ParticipantTableRow({
  participant,
  index,
  onView,
  onEdit,
  onDelete,
}: ParticipantTableRowProps) {
  // Helper function to get display name (Khmer preferred)
  const getDisplayName = (p: DashboardAthlete) => {
    return p.fullNameKhmer || p.name || "";
  };

  // Helper function to get organization display name
  const getOrganizationDisplay = (p: DashboardAthlete) => {
    return p.organization?.name || p.province || "";
  };

  // Helper function to get gender in Khmer
  const getGenderDisplay = (gender?: string) => {
    if (gender === "Male") return "ប្រុស";
    if (gender === "Female") return "ស្រី";
    return gender || "";
  };

  // Helper function to get role in Khmer
  const getRoleDisplay = (role?: string) => {
    if (role === "Athlete") return "អត្តពលិក";
    if (role === "Coach") return "គ្រូបង្វឹក";
    if (role === "Leader") return "ប្រធាន";
    if (role === "Official") return "មន្រ្តី";
    return role || "";
  };

  const formattedDate = participant.registeredAt
    ? formatDateToDDMMYYYYKhmer(new Date(participant.registeredAt))
    : "";

  return (
    <TableRow className="group transition-colors hover:bg-slate-50/50">
      <TableCell className="text-slate-400 text-sm">
        {toKhmerDigits(index + 1)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <ParticipantAvatar
            photoUrl={participant.photoUrl}
            name={participant.name}
            size="sm"
          />
          <div>
            <p className="font-semibold text-slate-700">
              {getDisplayName(participant)}
            </p>
            {participant.phone && (
              <p className="text-xs text-slate-400">{participant.phone}</p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-slate-500">
        {getGenderDisplay(participant.gender)}
      </TableCell>
      <TableCell className="text-slate-500">
        {getOrganizationDisplay(participant)}
      </TableCell>
      <TableCell className="text-slate-500">
        {participant.sport || ""}
      </TableCell>
      <TableCell className="text-slate-500">
        {getRoleDisplay(participant.position?.role)}
      </TableCell>
      <TableCell className="text-slate-400 text-sm">{formattedDate}</TableCell>
      <TableCell>
        <StatusBadge status={participant.status} />
      </TableCell>
      <TableCell>
        <ActionButtons
          onView={onView ? () => onView(participant) : undefined}
          onEdit={onEdit ? () => onEdit(participant) : undefined}
          onDelete={onDelete ? () => onDelete(participant.id) : undefined}
        />
      </TableCell>
    </TableRow>
  );
}

export default ParticipantTableRow;
