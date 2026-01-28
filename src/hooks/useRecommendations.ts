/**
 * Custom hooks for recommendation engine
 */

import { useEffect, useState } from 'react';
import type { Event, Sport } from '@/src/types';

export interface EventRecommendation {
  id: string;
  score: number;
  reason: string;
  event: Event;
}

export interface SportRecommendation {
  id: string;
  score: number;
  reason: string;
  sport: Sport;
}

interface UseRecommendedEventsState {
  recommendations: EventRecommendation[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch recommended events for an athlete
 */
export function useRecommendedEvents(
  athleteId: string | null,
  sport?: string,
  level?: string,
  registeredEventIds: string[] = []
): UseRecommendedEventsState {
  const [state, setState] = useState<UseRecommendedEventsState>({
    recommendations: [],
    loading: false,
    error: null
  });

  // Memoize the registered IDs string to avoid complex expression in deps
  const registeredIdsKey = registeredEventIds.join(',');

  useEffect(() => {
    if (!athleteId) return;

    const fetchRecommendations = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const params = new URLSearchParams({
          athleteId,
          ...(sport && { sport }),
          ...(level && { level }),
          ...(registeredIdsKey && { registered: registeredIdsKey })
        });

        const response = await fetch(`/api/recommendations/events?${params}`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');

        const data = await response.json();
        setState(prev => ({
          ...prev,
          recommendations: data.recommendations,
          loading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false
        }));
      }
    };

    fetchRecommendations();
  }, [athleteId, sport, level, registeredIdsKey]);

  return state;
}

interface UseTrendingEventsState {
  trending: EventRecommendation[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch trending events
 */
export function useTrendingEvents(): UseTrendingEventsState {
  const [state, setState] = useState<UseTrendingEventsState>({
    trending: [],
    loading: false,
    error: null
  });

  useEffect(() => {
    const fetchTrending = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetch('/api/recommendations/trending');
        if (!response.ok) throw new Error('Failed to fetch trending events');

        const data = await response.json();
        setState(prev => ({
          ...prev,
          trending: data.trending,
          loading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false
        }));
      }
    };

    fetchTrending();
    
    // Refresh trending events every 30 minutes
    const interval = setInterval(fetchTrending, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return state;
}

/**
 * Hook to calculate recommendation score for display
 */
export function useRecommendationScore(score: number): string {
  if (score >= 0.8) return 'Excellent match';
  if (score >= 0.6) return 'Good match';
  if (score >= 0.4) return 'Recommended';
  return 'Possible interest';
}
