'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { SportBadges, EventDateRange, ScoreBadge } from '@/src/components/ui/eventElements';
import type { Event } from '@/src/types';

interface RecommendationCardProps {
  event: Event;
  score: number;
  reason: string;
  onSelect?: (event: Event) => void;
  isSelected?: boolean;
}

export function RecommendationCard({
  event,
  score,
  reason,
  onSelect,
  isSelected = false
}: RecommendationCardProps) {
  const content = (
    <motion.div whileHover={{ y: -5 }} className="cursor-pointer">
      <Card className={`overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-slate-800">
              {event.name ?? event.title}
            </CardTitle>
            {event.location && (
              <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ScoreBadge score={score} />
            <div className="p-2 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Why Recommended */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-slate-50 p-3 rounded-lg">
            <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <span>{reason}</span>
          </div>

          {/* Date */}
          <EventDateRange startDate={event.startDate} endDate={event.endDate} />

          {/* Sports Badges */}
          <div className="flex items-center justify-between">
            <SportBadges sports={event.sports ?? []} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (onSelect) {
    return (
      <div onClick={() => onSelect(event)} className="w-full">
        {content}
      </div>
    );
  }

  return content;
}
