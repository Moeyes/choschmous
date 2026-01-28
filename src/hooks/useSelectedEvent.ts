"use client";

import { useEffect, useState } from 'react';
import { useEvents } from '@/src/hooks/useEvents';
import type { Event } from '@/src/types';

/**
 * Hook to get the currently selected event based on route or default to first event
 */
export function useSelectedEvent(routeEventId?: string) {
  const { events, loading: eventsLoading } = useEvents();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = () => {
      setLoading(true);
      try {
        const preferredId = routeEventId ?? (events.length ? events[0].id : null);
        const found = events.find((e) => e.id === preferredId) ?? null;
        if (active) setEvent(found);
      } catch (err) {
        console.error('Failed to select event', err);
        if (active) setEvent(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => { active = false; };
  }, [events, routeEventId]);

  return { event, loading: loading || eventsLoading };
}
