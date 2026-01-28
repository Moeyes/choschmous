'use client';

import React from 'react';
import { useTrendingEvents } from '@/src/hooks/useRecommendations';
import { RecommendationCard } from './RecommendationCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';
import type { Event } from '@/src/types';

interface TrendingEventsSectionProps {
  onEventSelect?: (event: Event) => void;
}

export function TrendingEventsSection({
  onEventSelect
}: TrendingEventsSectionProps) {
  const { trending, loading, error } = useTrendingEvents();

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle>Trending Events Error</CardTitle>
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
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-2xl font-bold">Trending Events</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (trending.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h2 className="text-2xl font-bold">Trending Events</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Popular events gaining momentum
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {trending.map(rec => (
          <RecommendationCard
            key={rec.id}
            event={rec.event}
            score={rec.score}
            reason={rec.reason}
            onSelect={onEventSelect}
          />
        ))}
      </div>
    </div>
  );
}
