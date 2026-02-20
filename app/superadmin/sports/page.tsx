"use client";

import { useState, useEffect } from "react";
import { SportsSection } from "@/src/features/dashboard/components";
import type {
  DashboardSport,
  DashboardParticipant,
} from "@/src/features/dashboard/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/src/config/constants";

export default function SportsPage() {
  const [sports, setSports] = useState<DashboardSport[]>([]);
  const [participants, setParticipants] = useState<DashboardParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create / edit dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<DashboardSport | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formStatus, setFormStatus] = useState("upcoming");

  const openCreateSport = () => {
    setFormName("");
    setFormCategory("");
    setFormStatus("upcoming");
    setIsCreateOpen(true);
  };

  const submitCreateSport = async () => {
    const payload = {
      name: formName,
      category: formCategory || "General",
      status: formStatus,
    };
    try {
      const res = await fetch(API_ENDPOINTS.superadmin.sports, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create sport");
      const created = await res.json();
      setSports((prev) => [created, ...prev]);
    } catch (err) {
      console.error(err);
      setSports((prev) => [
        {
          id: String(Date.now()),
          name: formName,
          category: formCategory || "General",
          participants: 0,
          status: formStatus,
        },
        ...prev,
      ]);
    } finally {
      setIsCreateOpen(false);
    }
  };

  const openEditSport = (s: DashboardSport) => {
    setEditingSport(s);
    setFormName(s.name || "");
    setFormCategory(s.category || "");
    setFormStatus(s.status || "upcoming");
    setIsEditOpen(true);
  };

  const submitEditSport = async () => {
    if (!editingSport) return;
    const payload = {
      ...editingSport,
      name: formName,
      category: formCategory,
      status: formStatus,
    };
    try {
      const res = await fetch(API_ENDPOINTS.superadmin.sports, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update sport");
      const updated = await res.json();
      setSports((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error(err);
      setSports((prev) =>
        prev.map((p) =>
          p.id === payload.id ? (payload as DashboardSport) : p,
        ),
      );
    } finally {
      setIsEditOpen(false);
      setEditingSport(null);
    }
  };

  useEffect(() => {
    async function loadSports() {
      try {
        const [sportsRes, aggRes] = await Promise.all([
          fetch(API_ENDPOINTS.superadmin.sports),
          fetch("/api/superadmin"),
        ]);
        const sportsData = sportsRes.ok ? await sportsRes.json() : [];
        const aggData = aggRes.ok ? await aggRes.json() : {};
        setSports(sportsData || aggData.sports || []);
        setParticipants(aggData.participants || []);
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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        API_ENDPOINTS.superadmin.sports + `?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Failed to delete sport");
      setSports((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      // fallback to local update
      setSports((prev) => prev.filter((s) => s.id !== id));
    }
  };

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>;
  }

  return (
    <div className="p-6">
      {/* Create Sport Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={() => setIsCreateOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>បន្ថែមកីឡាថ្មី</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>ឈ្មោះកីឡា</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <Label>ប្រភេទ</Label>
              <Input
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                ចាកចេញ
              </Button>
              <Button onClick={submitCreateSport}>បន្ថែម</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Sport Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={() => {
          setIsEditOpen(false);
          setEditingSport(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>កែប្រែកีฬา</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>ឈ្មោះកីឡា</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <Label>ប្រភេទ</Label>
              <Input
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingSport(null);
                }}
              >
                ចាកចេញ
              </Button>
              <Button onClick={submitEditSport}>រក្សាទុក</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SportsSection
        sports={enhancedSports}
        onDeleteSport={handleDelete}
        onCreateSport={openCreateSport}
        onEditSport={openEditSport}
        mode="superadmin"
      />
    </div>
  );
}
