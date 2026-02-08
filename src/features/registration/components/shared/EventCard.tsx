import { Check } from "lucide-react";
import type { Event } from "@/src/types/event";

interface EventCardProps {
  event: Event;
  isSelected: boolean;
  onClick: () => void;
}

export function EventCard({ event, isSelected, onClick }: EventCardProps) {
  return (
    <button
      onClick={onClick}
      className={`event-card ${isSelected ? "selected" : ""}`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="event-card-check">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Event Name */}
      <h3 className={`event-card-title ${isSelected ? "selected" : ""}`}>
        {event.name}
      </h3>

      {/* Event Details */}
      <div className="space-y-2 text-sm">
        {event.startDate && event.endDate && (
          <p className={`event-card-text ${isSelected ? "selected" : ""}`}>
            {new Date(event.startDate).toLocaleDateString()} -{" "}
            {new Date(event.endDate).toLocaleDateString()}
          </p>
        )}
        {event.location && (
          <p className={`event-card-text ${isSelected ? "selected" : ""}`}>
            📍 {event.location}
          </p>
        )}
      </div>

      {/* Sports Count */}
      {event.sports && event.sports.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p
            className={`text-xs font-medium ${isSelected ? "text-indigo-600" : "text-slate-500"}`}
          >
            មាន {event.sports.length} កីឡា
          </p>
        </div>
      )}
    </button>
  );
}
