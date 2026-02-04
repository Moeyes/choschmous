"use client";

import type { DashboardEvent } from "../types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type EventCardProps = {
  event: DashboardEvent;
  onClick?: () => void;
  index?: number;
};

function EventCard({ event, onClick, index = 0 }: EventCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      onClick={onClick}
      className="border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden relative group cursor-pointer"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{event.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </p>
          </div>
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-lg px-3 py-1">
            Active
          </Badge>
        </div>
        <div className="flex gap-2 flex-wrap">
          {event.sports?.slice(0, 3).map((sport, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              {typeof sport === "string"
                ? sport
                : ((sport as any)?.name ?? "Sport")}
            </Badge>
          ))}
          {event.sports && event.sports.length > 3 && (
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-600 rounded-lg"
            >
              +{event.sports.length - 3}
            </Badge>
          )}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform" />
    </Card>
  );
}

type CreateEventDialogProps = {
  onCreate: (event: DashboardEvent) => void;
};

function CreateEventDialog({ onCreate }: CreateEventDialogProps) {
  // Simple button for now - can be expanded to a full dialog
  return (
    <Button className="bg-[#1a4cd8] hover:bg-blue-700 rounded-xl gap-2 h-11">
      <Plus className="h-4 w-4" />
      <span>Create Event</span>
    </Button>
  );
}

export function EventsSection({
  events,
  onCreate,
  onSelect,
}: {
  events: DashboardEvent[];
  onCreate: (e: DashboardEvent) => void;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Events</h3>
        <CreateEventDialog onCreate={onCreate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => onSelect(event.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default EventsSection;
