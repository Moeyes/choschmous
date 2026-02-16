"use client";

import { useState, useEffect } from "react";
import { SportsSection } from "@/src/features/dashboard/components";
import type {
  DashboardSport,
  DashboardParticipant,
} from "@/src/features/dashboard/types/types";

export default function SportsPage() {
  const [sports, setSports] = useState<DashboardSport[]>([]);
  const [participants, setParticipants] = useState<DashboardParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSports() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setSports(data.sports || []);
        setParticipants(data.participants || []);
      } catch (error) {
        console.error("Failed to load sports:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSports();
  }, []);

  // Enhance sports with detailed stats
  const enhancedSports = sports.map((sport) => {
    const sportParticipants = participants.filter(
      (p) => p.sport === sport.name || p.sportId === sport.id,
    );
    const athletes = sportParticipants.filter(
      (p) => p.position?.role === "Athlete",
    ).length;
    const leaders = sportParticipants.filter(
      (p) => p.position?.role === "Leader",
    ).length;
    const coaches = sportParticipants.filter(
      (p) => p.position?.role === "Coach",
    ).length;

    return {
      ...sport,
      totalParticipants: sportParticipants.length,
      athletes,
      leaders,
      coaches,
    };
  });

  const handleDelete = (id: string) => {
    setSports((prev) => prev.filter((s) => s.id !== id));
  };

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>;
  }

  return (
    <div className="p-6">
      <SportsSection sports={enhancedSports} onDeleteSport={handleDelete} />
    </div>
  );
}
