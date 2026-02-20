"use client";

import { useState, useEffect } from "react";
import { ParticipantsSection } from "@/src/features/dashboard/components";
import { ParticipantEditDialog } from "@/src/features/dashboard/components/participants/ParticipantEditDialog";
import type { DashboardParticipant } from "@/src/features/dashboard/types/types";
import { Button } from "@/src/components/ui/button";
import { API_ENDPOINTS } from "@/src/config/constants";

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

  // Create dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newParticipant, setNewParticipant] =
    useState<DashboardParticipant | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.superadmin.registrations, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete participant");
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleCreate = () => {
    const placeholder: DashboardParticipant = {
      id: `NEW-${Date.now()}`,
      name: "",
      province: "",
      sport: "",
      status: "pending",
    } as DashboardParticipant;
    setNewParticipant(placeholder);
    setIsCreateOpen(true);
  };

  const handleCreateSave = async (participant: DashboardParticipant) => {
    try {
      const res = await fetch(API_ENDPOINTS.superadmin.registrations, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Date.now(), ...participant }),
      });
      if (!res.ok) throw new Error("Failed to create participant");
      const data = await res.json();
      const created = data?.registration ?? participant;
      setParticipants((prev) => [created as DashboardParticipant, ...prev]);
    } catch (err) {
      console.error(err);
      setParticipants((prev) => [participant, ...prev]);
    } finally {
      setIsCreateOpen(false);
      setNewParticipant(null);
    }
  };

  const handleEdit = (participant: DashboardParticipant) => {
    // ParticipantsSection already performs PUT when editing; update local state when callback is invoked
    setParticipants((prev) =>
      prev.map((p) => (p.id === participant.id ? participant : p)),
    );
  };

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
        onEditAthlete={handleEdit}
        onDeleteAthlete={handleDelete}
        onCreateAthlete={handleCreate}
        mode="superadmin"
      />

      {/* Create participant dialog (reuses ParticipantEditDialog) */}
      {newParticipant && (
        <ParticipantEditDialog
          participant={newParticipant}
          open={isCreateOpen}
          onClose={() => {
            setIsCreateOpen(false);
            setNewParticipant(null);
          }}
          onSave={handleCreateSave}
        />
      )}
    </div>
  );
}
