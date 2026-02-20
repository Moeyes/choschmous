"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { DashboardBanner } from "../overview/Banner";
import StatsGrid from "../overview/StatsGrid";
import { EventsSection } from "../sections/EventsSection";
import { QuickActions } from "../overview/QuickActions";
import { ParticipantsSection } from "../participants/ParticipantsSection";
import { SportsSection } from "../sections/SportsSection";
import { ProvincesSection } from "../sections/ProvincesSection";

import type {
  DashboardParticipant,
  DashboardEvent,
  DashboardSport,
  DashboardProvince,
  DashboardStats,
} from "../types";
import { color } from "framer-motion";

type DashboardContentProps = {
  // Data props - can be passed in or use defaults
  events?: DashboardEvent[];
  participants?: DashboardParticipant[];
  athletes?: DashboardParticipant[]; // Kept for backward compatibility with prop passing
  sports?: DashboardSport[];
  provinces?: DashboardProvince[];

  // Initial view
  initialView?: string;

  // Mode: controls whether CRUD controls are shown (default: admin)
  mode?: "admin" | "superadmin";

  // Callbacks
  onEventSelect?: (eventId: string | null) => void;
  onViewChange?: (view: string) => void;
};

export function DashboardContent({
  events: initialEvents = [],
  participants: initialParticipants,
  athletes: initialAthletes = [],
  sports: initialSports = [],
  provinces: initialProvinces = [],
  initialView = "dashboard",
  mode = "admin",
  onEventSelect,
  onViewChange,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventIdFromUrl = searchParams?.get("event") ?? null;
  const currentView = searchParams?.get("view") || initialView;

  const [events, setEvents] = useState<DashboardEvent[]>(initialEvents);
  const [participants, setParticipants] = useState<DashboardParticipant[]>(
    initialParticipants || initialAthletes,
  );
  const [sports, setSports] = useState<DashboardSport[]>(initialSports);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    eventIdFromUrl,
  );

  useEffect(() => {
    setSelectedEventId(eventIdFromUrl);
  }, [eventIdFromUrl]);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    setParticipants(initialParticipants || initialAthletes);
  }, [initialParticipants, initialAthletes]);

  useEffect(() => {
    setSports(initialSports);
  }, [initialSports]);

  const currentParticipants = useMemo(() => {
    if (selectedEventId) {
      return participants.filter((p) => p.eventId === selectedEventId);
    }
    return participants;
  }, [participants, selectedEventId]);

  const provinceStats = useMemo((): DashboardProvince[] => {
    if (initialProvinces.length > 0) return initialProvinces;

    const provincesMap: Record<string, DashboardProvince> = {};
    currentParticipants.forEach((p) => {
      const key = p.province || "Unknown";
      if (!provincesMap[key]) {
        provincesMap[key] = { name: key, participants: 0, total: 0 };
      }
      provincesMap[key].participants += 1;
      provincesMap[key].total = provincesMap[key].participants;
    });
    return Object.values(provincesMap).sort(
      (a, b) => b.participants - a.participants,
    );
  }, [currentParticipants, initialProvinces]);

  const stats: DashboardStats = useMemo(
    () => ({
      participants: participants.length,
      sports: sports.length,
      provinces: provinceStats.length,
      events: events.length,
    }),
    [participants, sports, provinceStats, events],
  );

  const handleSelectEvent = (id: string | null) => {
    const base = mode === "superadmin" ? "/superadmin" : "/dashboard";
    if (id) {
      router?.push?.(`${base}/events/${id}`);
    } else {
      router?.push?.("/");
    }
    setSelectedEventId(id);
    onEventSelect?.(id);
  };

  const handleCreateEvent = (event: DashboardEvent) => {
    setEvents((prev) => [event, ...prev]);
  };

  const statsItems = [
    { label: "អ្អ្នកចូលរួម", value: stats.participants, color: "bg-blue-600" },
    { label: "កីឡា", value: stats.sports, color: "bg-green-600" },
    { label: "អង្គភាព", value: stats.provinces, color: "bg-yellow-600" },
  ];

  return (
    <div className="space-y-8">
      {(currentView === "dashboard" || !currentView) && (
        <>
          <DashboardBanner />
          <StatsGrid items={statsItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <EventsSection
                events={events}
                onCreate={() => {}}
                onSelect={handleSelectEvent}
                mode={mode}
              />
            </div>
            <div className="space-y-6">
              <QuickActions />
            </div>
          </div>
        </>
      )}

      {currentView === "participants" && (
        <ParticipantsSection athletes={currentParticipants} mode={mode} />
      )}

      {currentView === "sports" && (
        <SportsSection sports={sports} mode={mode} />
      )}

      {currentView === "provinces" && (
        <ProvincesSection provinces={provinceStats} mode={mode} />
      )}
    </div>
  );
}

export default DashboardContent;
