import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { SportBadges, EventDateRange } from "@/src/components/ui/eventElements";
import type { Event } from "@/src/types/event";

interface EventCardProps {
  event: Event;
  index?: number;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const defaultHref = `/events/${event.id}`;

  const content = (
    <motion.div whileHover={{ y: -5 }} className="cursor-pointer">
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
          <CardTitle className="text-lg font-bold text-slate-800">{event.name ?? event.title}</CardTitle>
          <div className="p-2 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ChevronRight className="h-4 w-4" />
          </div>
        </CardHeader>
        

        <CardContent className="p-6 space-y-4">
          <EventDateRange startDate={event.startDate} endDate={event.endDate} />

          <div className="flex items-center justify-between">
            <SportBadges sports={event.sports ?? []} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );


  if (onClick) {
    return (
      <div onClick={onClick} className="w-full">
        {content}
      </div>
    );
  }

  return (
    <a href={defaultHref} aria-label={`Open ${event.name ?? event.title}`}>
      {content}
    </a>
  );
}
