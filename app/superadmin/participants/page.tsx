"use client";

import { useState, useEffect } from "react";
import { ParticipantsSection } from "@/src/features/dashboard/components";
import type { DashboardParticipant } from "@/src/features/dashboard/types/types";
import { Button } from "@/src/components/ui/button";

type RoleFilter = "all" | "Athlete" | "Leader";

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<DashboardParticipant[]>([]);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  useEffect(() => {
    async function loadParticipants() {
      try {
        const res = await fetch("/api/superadmin");
        const data = await res.json();
        setParticipants(data.participants || []);
      } catch (error) {
        console.error("Failed to load participants:", error);
      }
    }
    loadParticipants();
  }, []);

  const filteredParticipants =
    roleFilter === "all"
      ? participants
      : participants.filter((p) => p.position?.role === roleFilter);

  return (
    <div className="p-6 space-y-4">
      {/* Role Filter Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setRoleFilter("all")}
          variant={roleFilter === "all" ? "default" : "outline"}
          className="rounded-lg"
        >
          អ្នកចូលរួមទាំងអស់ ({participants.length})
        </Button>
        <Button
          onClick={() => setRoleFilter("Athlete")}
          variant={roleFilter === "Athlete" ? "default" : "outline"}
          className="rounded-lg"
        >
          កីឡាករ/កីឡាការិនី (
          {participants.filter((p) => p.position?.role === "Athlete").length})
        </Button>
        <Button
          onClick={() => setRoleFilter("Leader")}
          variant={roleFilter === "Leader" ? "default" : "outline"}
          className="rounded-lg"
        >
          អ្នកដឹកនាំ (
          {participants.filter((p) => p.position?.role === "Leader").length})
        </Button>
      </div>

      <ParticipantsSection
        athletes={filteredParticipants}
        onViewAthlete={(participant) => console.log("View:", participant)}
        onEditAthlete={(participant) => console.log("Edit:", participant)}
        onDeleteAthlete={(id) => console.log("Delete:", id)}
        onCreateAthlete={() => console.log("Create new participant")}
      />
    </div>
  );
}
