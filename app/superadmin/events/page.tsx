"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventsSection } from "@/src/features/dashboard/components";
import type { DashboardEvent } from "@/src/features/dashboard/types/types";
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

export default function EventsPage() {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Dialog / form state for create / edit
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DashboardEvent | null>(null);
  const [formName, setFormName] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formStatus, setFormStatus] = useState("upcoming");

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/superadmin");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  const handleSelect = (id: string | null) => {
    if (id) {
      router.push(`/superadmin/events/${id}`);
    }
  };

  const openCreate = () => {
    setFormName("");
    setFormStart("");
    setFormEnd("");
    setFormStatus("upcoming");
    setIsCreateOpen(true);
  };

  const submitCreate = async () => {
    const payload: Partial<DashboardEvent> = {
      name: formName,
      startDate: formStart,
      endDate: formEnd,
      status: formStatus,
    };
    try {
      const res = await fetch(API_ENDPOINTS.superadmin.events, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create event");
      const created = await res.json();
      setEvents((prev) => [created, ...prev]);
    } catch (err) {
      console.error(err);
      setEvents((prev) => [
        {
          id: `evt-${Date.now()}`,
          name: formName,
          startDate: formStart,
          endDate: formEnd,
          status: formStatus,
        } as DashboardEvent,
        ...prev,
      ]);
    } finally {
      setIsCreateOpen(false);
    }
  };

  const openEdit = (ev: DashboardEvent) => {
    setEditingEvent(ev);
    setFormName(ev.name || "");
    setFormStart(ev.startDate || "");
    setFormEnd(ev.endDate || "");
    setFormStatus(ev.status || "upcoming");
    setIsEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editingEvent) return;
    const payload = {
      ...editingEvent,
      name: formName,
      startDate: formStart,
      endDate: formEnd,
      status: formStatus,
    };
    try {
      const res = await fetch(API_ENDPOINTS.superadmin.events, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update event");
      const updated = await res.json();
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } catch (err) {
      console.error(err);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === payload.id ? (payload as DashboardEvent) : e,
        ),
      );
    } finally {
      setIsEditOpen(false);
      setEditingEvent(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("តើអ្នកចង់លុបព្រឹត្តិការណ៍នេះដែរឬទេ?")) return;
    try {
      const res = await fetch(
        `${API_ENDPOINTS.superadmin.events}?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  if (isLoading) {
    return <div className="p-8">កំពុងផ្ទុកទិន្នន័យ...</div>;
  }

  return (
    <div className="p-6">
      {/* Create dialog */}
      <Dialog open={isCreateOpen} onOpenChange={() => setIsCreateOpen(false)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>បង្កើតព្រឹត្តិការណ៍ថ្មី</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>ឈ្មោះព្រឹត្តិការណ៍</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ថ្ងៃចាប់ផ្ដើម</Label>
                <Input
                  type="date"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                />
              </div>
              <div>
                <Label>ថ្ងៃបញ្ចប់</Label>
                <Input
                  type="date"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                ចាកចេញ
              </Button>
              <Button onClick={submitCreate}>បង្កើត</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={() => {
          setIsEditOpen(false);
          setEditingEvent(null);
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>កែប្រែព្រឹត្តិការណ៍</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>ឈ្មោះព្រឹត្តិការណ៍</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ថ្ងៃចាប់ផ្ដើម</Label>
                <Input
                  type="date"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                />
              </div>
              <div>
                <Label>ថ្ងៃបញ្ចប់</Label>
                <Input
                  type="date"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingEvent(null);
                }}
              >
                ចាកចេញ
              </Button>
              <Button onClick={submitEdit}>រក្សាទុក</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EventsSection
        events={events}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
        mode="superadmin"
      />
    </div>
  );
}
