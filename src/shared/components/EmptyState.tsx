"use client";

import { cn } from "@/src/lib/utils";
import { FileX, Users, Trophy, MapPin } from "lucide-react";
import { EMPTY_MESSAGES } from "@/src/config/constants";

type EmptyStateType =
  | "participants"
  | "sports"
  | "events"
  | "provinces"
  | "search"
  | "default";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EMPTY_CONFIG: Record<
  EmptyStateType,
  { icon: React.ElementType; title: string; description: string }
> = {
  participants: {
    icon: Users,
    title: EMPTY_MESSAGES.participants.title,
    description: EMPTY_MESSAGES.participants.description,
  },
  sports: {
    icon: Trophy,
    title: EMPTY_MESSAGES.sports.title,
    description: EMPTY_MESSAGES.sports.description,
  },
  events: {
    icon: FileX,
    title: EMPTY_MESSAGES.events.title,
    description: EMPTY_MESSAGES.events.description,
  },
  provinces: {
    icon: MapPin,
    title: EMPTY_MESSAGES.provinces.title,
    description: EMPTY_MESSAGES.provinces.description,
  },
  search: {
    icon: FileX,
    title: EMPTY_MESSAGES.search.title,
    description: EMPTY_MESSAGES.search.description,
  },
  default: {
    icon: FileX,
    title: "មិនមានទិន្នន័យ",
    description: "មិនមានទិន្នន័យដែលត្រូវបង្ហាញ",
  },
};

export function EmptyState({
  type = "default",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const config = EMPTY_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
    >
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm">
        {description || config.description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
