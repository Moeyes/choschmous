"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/src/config/constants";
import type { Event } from "@/src/types/event";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.events);
        const data = await res.json();
        if (mounted) setEvents(data ?? data.events ?? []);
      } catch (err) {
        // keep silent; consumer components should handle empty state
        console.error("useEvents: failed to load events", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { events, loading } as const;
}
