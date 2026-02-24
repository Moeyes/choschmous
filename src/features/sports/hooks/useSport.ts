import { useEffect, useState } from "react";
import type { DashboardSport, DashboardParticipant } from "../types";
import { sportsService } from "../services/sportService";

export function useSports() {
  const [sports, setSports] = useState<DashboardSport[]>([]);
  const [participants, setParticipants] = useState<DashboardParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sportsData, aggRes] = await Promise.all([
          sportsService.getAll(),
          fetch("/api/superadmin").then((r) => r.json()),
        ]);

        setSports(sportsData || aggRes.sports || []);
        setParticipants(aggRes.participants || []);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const enhancedSports = sports.map((sport) => {
    const sportParticipants = participants.filter(
      (p) => p.sport === sport.name || p.sportId === sport.id,
    );

    return {
      ...sport,
      totalParticipants: sportParticipants.length,
      athletes: sportParticipants.filter((p) => p.position?.role === "Athlete")
        .length,
      leaders: sportParticipants.filter((p) => p.position?.role === "Leader")
        .length,
      coaches: sportParticipants.filter((p) => p.position?.role === "Coach")
        .length,
    };
  });

  return {
    sports: enhancedSports,
    rawSports: sports,
    setSports,
    isLoading,
  };
}
