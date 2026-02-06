"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/src/features/events/hooks/useEvents";
import { EventCard } from "@/src/features/events/components/EventCard";
import { REGISTRATION_STEP_PARAMS } from "@/src/config/constants";
import { Skeleton } from "@/src/components/ui/skeleton";

export function EventSelection() {
  const router = useRouter();
  const { events, loading } = useEvents();

  const handleSelectEvent = (eventId: string) => {
    // Store selected event ID in session storage or context
    sessionStorage.setItem("selectedEventId", eventId);
    router.push(`/register?step=${REGISTRATION_STEP_PARAMS.sport}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          ជ្រើសរើសព្រឹត្តិការណ៍
        </h2>
        <p className="text-slate-600">
          សូមជ្រើសរើសព្រឹត្តិការណ៍ដែលអ្នកចង់ចុះឈ្មោះចូលរួម
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => handleSelectEvent(event.id)}
            />
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>មិនមានព្រឹត្តិការណ៍នៅពេលនេះ</p>
        </div>
      )}
    </div>
  );
}
