"use client";

import { Users } from "lucide-react";
import StatsGrid from "../overview/StatsGrid";
import { useMemo } from "react";
import type { DashboardAthlete } from "../types";

interface ParticipantStatsProps {
  participants: DashboardAthlete[];
}

export function ParticipantStats({ participants }: ParticipantStatsProps) {
  const stats = useMemo(() => {
    const total = participants.length;
    const approved = participants.filter(
      (a) => a.status?.toLowerCase() === "approved",
    ).length;
    const pending = participants.filter(
      (a) => a.status?.toLowerCase() === "pending",
    ).length;
    const rejected = participants.filter(
      (a) => a.status?.toLowerCase() === "rejected",
    ).length;
    return { total, approved, pending, rejected };
  }, [participants]);

  return (
    <StatsGrid
      items={[
        {
          label: "សរុប",
          value: String(stats.total),
          color: "bg-blue-100",
          icon: <Users className="h-5 w-5 text-blue-600" />,
        },
        {
          label: "អនុម័ត",
          value: String(stats.approved),
          color: "bg-green-100",
          icon: <Users className="h-5 w-5 text-green-600" />,
        },
        {
          label: "កំពុងរង់ចាំ",
          value: String(stats.pending),
          color: "bg-yellow-100",
          icon: <Users className="h-5 w-5 text-yellow-600" />,
        },
        {
          label: "បដិសេធ",
          value: String(stats.rejected),
          color: "bg-red-100",
          icon: <Users className="h-5 w-5 text-red-600" />,
        },
      ]}
    />
  );
}

export default ParticipantStats;
