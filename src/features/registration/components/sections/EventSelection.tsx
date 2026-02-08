"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEvents } from "@/src/features/events/hooks/useEvents";
import { REGISTRATION_STEP_PARAMS } from "@/src/config/constants";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  EventCard,
  PageHeader,
  SelectedIndicator,
  SectionCard,
} from "../shared";

export function EventSelection() {
  const router = useRouter();
  const { events, loading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    // Load previously selected event from session storage
    const storedEventId = sessionStorage.getItem("selectedEventId");
    if (storedEventId) {
      setSelectedEventId(storedEventId);
    }
  }, []);

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    sessionStorage.setItem("selectedEventId", eventId);

    // Navigate after a brief delay to show selection feedback
    setTimeout(() => {
      router.push(`/register?step=${REGISTRATION_STEP_PARAMS.sport}`);
    }, 300);
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="ជ្រើសរើសព្រឹត្តិការណ៍"
        subtitle="ជ្រើសរើសព្រឹត្តិការណ៍ដែលអ្នកចង់ចូលរួម"
      />

      <SectionCard title="បញ្ជីព្រឹត្តិការណ៍" subtitle="ជ្រើសមួយដើម្បីបន្ត">
        {loading ? (
          <div className="event-grid">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isSelected={selectedEventId === event.id}
                onClick={() => handleSelectEvent(event.id)}
              />
            ))}
          </div>
        )}

        {selectedEvent && (
          <div className="pt-4">
            <SelectedIndicator label="បានជ្រើសរើស" value={selectedEvent.name} />
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            <p>មិនមានព្រឹត្តិការណ៍នៅពេលនេះទេ</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
