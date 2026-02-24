"use client";

import { useState } from "react";
import { SportsSection } from "@/src/features/dashboard/components";
import { useSports } from "../hooks/useSport";
import { sportsService } from "../services/sportService";
import { SportFormDialog } from "./SportFormDialog";
import type { DashboardSport } from "../types";
import { normalize } from "path";
import { normalizeSport } from "../utils/normalizeSport";

export function SportsContainer() {
  const { sports, rawSports, setSports, isLoading } = useSports();

  const [createOpen, setCreateOpen] = useState(false);
  const [editSport, setEditSport] = useState<DashboardSport | null>(null);

  async function handleCreate(data: { name: string; category: string }) {
    const created = await sportsService.create({
      ...data,
      status: "upcoming",
    });
    setSports((prev) => [created, ...prev]);
    setCreateOpen(false);
  }

  async function handleUpdate(data: { name: string; category: string }) {
    if (!editSport) return;
    const updated = await sportsService.update({
      ...editSport,
      ...data,
    });
    setSports((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditSport(null);
  }

  async function handleDelete(id: string) {
    await sportsService.remove(id);
    setSports((prev) => prev.filter((s) => s.id !== id));
  }

  if (isLoading) return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>;

  return (
    <>
      <SportFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        title="បន្ថែមកីឡាថ្មី"
      />

      <SportFormDialog
        open={!!editSport}
        onClose={() => setEditSport(null)}
        onSubmit={handleUpdate}
        initialData={editSport}
        title="កែប្រែកีฬา"
      />

      <SportsSection
        sports={sports.map((s) => ({
          ...s,
          participants: s.participants ?? 0, // Ensure participants is always a number
        }))}
        onCreateSport={() => setCreateOpen(true)}
        onEditSport={(s) => setEditSport(normalizeSport(s))}
        onDeleteSport={handleDelete}
        mode="superadmin"
      />
    </>
  );
}
