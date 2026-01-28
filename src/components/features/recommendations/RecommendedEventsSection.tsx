'use client';

import React from 'react';
import { useRecommendedEvents } from '@/src/hooks/useRecommendations';
import { RecommendationCard } from './RecommendationCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';
import type { Event } from '@/src/types';

interface RecommendedEventsSectionProps {
  athleteId: string | null;
  sport?: string;
  level?: string;
  registeredEventIds?: string[];
  onEventSelect?: (event: Event) => void;
}

export function RecommendedEventsSection({
  athleteId,
  sport,
  level,
  registeredEventIds = [],
  onEventSelect
}: RecommendedEventsSectionProps) {
  const { recommendations, loading, error } = useRecommendedEvents(
    athleteId,
    sport,
    level,
    registeredEventIds
  );

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle>Recommendations Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recommended Events</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Recommendations</CardTitle>
          <CardDescription>
            Complete your profile to get personalized event recommendations
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Recommended Events</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {recommendations.length} events tailored to your interests
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map(rec => (
          <RecommendationCard
            key={rec.id}
            event={rec.event}
            score={rec.score}
            reason={rec.reason}
            onSelect={onEventSelect}
            isSelected={registeredEventIds.includes(rec.event.id)}
          />
        ))}
      </div>
    </div>
  );
}
