"use client";

import { useState, useEffect } from "react";
import { ProvincesSection } from "@/src/features/dashboard/components";
import type {
  DashboardProvince,
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

function calcProvinces(
  participants: DashboardParticipant[],
): DashboardProvince[] {
  const provinces: Record<string, DashboardProvince> = {};
  participants.forEach((p) => {
    const key = p.province || "Unknown";
    if (!provinces[key]) {
      provinces[key] = { name: key, participants: 0, total: 0 };
    }
    provinces[key].participants += 1;
    provinces[key].total = provinces[key].participants;
  });
  return Object.values(provinces).sort(
    (a, b) => b.participants - a.participants,
  );
}

export default function ProvincesPage() {
  const [provinces, setProvinces] = useState<DashboardProvince[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProvinces() {
      try {
        const res = await fetch(API_ENDPOINTS.superadmin.provinces);
        const data = res.ok ? await res.json() : [];
        setProvinces(data || []);
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProvinces();
  }, []);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProvince, setEditingProvince] =
    useState<DashboardProvince | null>(null);
  const [provinceName, setProvinceName] = useState("");

  const handleCreateProvince = async () => {
    const payload = {
      name: `New Province ${Date.now()}`,
      participants: 0,
      total: 0,
    };
    try {
      const res = await fetch(API_ENDPOINTS.superadmin.provinces, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create province");
      const created = await res.json();
      setProvinces((prev) => [created, ...prev]);
    } catch (err) {
      console.error(err);
      setProvinces((prev) => [payload as DashboardProvince, ...prev]);
    }
  };

  const openEditProvince = (p: DashboardProvince) => {
    setEditingProvince(p);
    setProvinceName(p.name);
    setIsEditOpen(true);
  };

  const submitEditProvince = async () => {
    if (!editingProvince) return;
    const payload = { ...editingProvince, name: provinceName };
    try {
      const res = await fetch(API_ENDPOINTS.superadmin.provinces, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update province");
      const updated = await res.json();
      setProvinces((prev) =>
        prev.map((pp) => (pp.name === editingProvince.name ? updated : pp)),
      );
    } catch (err) {
      console.error(err);
      setProvinces((prev) =>
        prev.map((pp) =>
          pp.name === editingProvince.name
            ? (payload as DashboardProvince)
            : pp,
        ),
      );
    } finally {
      setIsEditOpen(false);
      setEditingProvince(null);
    }
  };

  const handleDeleteProvince = async (name: string) => {
    if (!confirm("តើអ្នកចង់លុបខេត្តនេះដែរឬទេ?")) return;
    try {
      const res = await fetch(
        `${API_ENDPOINTS.superadmin.provinces}?name=${encodeURIComponent(name)}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Failed to delete province");
      setProvinces((prev) => prev.filter((p) => p.name !== name));
    } catch (err) {
      console.error(err);
      setProvinces((prev) => prev.filter((p) => p.name !== name));
    }
  };

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>;
  }

  return (
    <div className="p-6">
      <ProvincesSection
        provinces={provinces}
        onCreateProvince={handleCreateProvince}
        onEditProvince={openEditProvince}
        onDeleteProvince={handleDeleteProvince}
        mode="superadmin"
      />

      {/* Edit Province Dialog */}
      <Dialog open={isEditOpen} onOpenChange={() => setIsEditOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>កែប្រែខេត្ត</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>ឈ្មោះខេត្ត</Label>
              <Input
                value={provinceName}
                onChange={(e) => setProvinceName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                ចាកចេញ
              </Button>
              <Button onClick={submitEditProvince}>រក្សាទុក</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
