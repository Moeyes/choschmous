/**
 * Recommendation Engine Service
 * Implements collaborative filtering and content-based recommendations
 * for events, sports, and athletes
 */

import type { Event, Athlete, Sport } from '@/src/types';

export interface RecommendationScore {
  id: string;
  score: number;
  reason: string;
}

export interface EventRecommendation extends RecommendationScore {
  event: Event;
}

export interface SportRecommendation extends RecommendationScore {
  sport: Sport;
}

/**
 * Recommend events based on athlete's interests and past registrations
 */
export function recommendEvents(
  athlete: Partial<Athlete>,
  allEvents: Event[],
  registeredEventIds: string[] = []
): EventRecommendation[] {
  const recommendations: EventRecommendation[] = [];

  // Filter out already registered events
  const unregisteredEvents = allEvents.filter(e => !registeredEventIds.includes(e.id));

  unregisteredEvents.forEach(event => {
    let score = 0;
    let reason = '';

    // Sport category match (40% weight)
    if (athlete.sportCategory && event.sports && event.sports.length > 0) {
      const eventSportNames = event.sports.map(s =>
        typeof s === 'string' ? s : s.id || s.name || ''
      ).join('|').toLowerCase();

      const sportMatch = eventSportNames.includes(athlete.sportCategory.toLowerCase()) ? 0.4 : 0;

      score += sportMatch;
      if (sportMatch > 0) reason += 'Matches your sport category. ';
    } else if (event.sports && event.sports.length > 0) {
      score += 0.1;
      reason += 'Has sports you might be interested in. ';
    }

    // Event status check (10% weight)
    if (event.status === 'upcoming') {
      score += 0.1;
      reason += 'Upcoming event. ';
    }

    // Recency boost (20% weight)
    if (event.startDate) {
      try {
        const eventDate = new Date(event.startDate).getTime();
        const now = new Date().getTime();
        const daysUntilEvent = (eventDate - now) / (1000 * 60 * 60 * 24);

        if (daysUntilEvent > 0 && daysUntilEvent < 90) {
          score += 0.2;
          reason += 'Coming soon. ';
        } else if (daysUntilEvent > 90 && daysUntilEvent < 365) {
          score += 0.05;
        }
      } catch {
        // Ignore date parsing errors
      }
    }

    if (score > 0) {
      recommendations.push({
        id: event.id,
        score,
        reason: reason.trim(),
        event
      });
    }
  });

  // Sort by score descending
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations;
}

interface RegistrationRecord {
  id: string;
  eventId?: string;
  registeredAt?: string;
  [key: string]: unknown;
}

/**
 * Get trending events based on registration count and recency
 */
export function getTrendingEvents(
  allEvents: Event[],
  registrations: RegistrationRecord[]
): EventRecommendation[] {
  const eventRegistrationCounts: Record<string, number> = {};
  const recentRegistrations: Record<string, number> = {};

  const now = new Date().getTime();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  // Count registrations per event
  registrations.forEach(reg => {
    if (reg.eventId) {
      eventRegistrationCounts[reg.eventId] = (eventRegistrationCounts[reg.eventId] || 0) + 1;

      // Count recent registrations
      if (reg.registeredAt) {
        const regDate = new Date(reg.registeredAt).getTime();
        if (regDate > weekAgo) {
          recentRegistrations[reg.eventId] = (recentRegistrations[reg.eventId] || 0) + 1;
        }
      }
    }
  });

  const trending: EventRecommendation[] = allEvents.map(event => {
    const totalRegs = eventRegistrationCounts[event.id] || 0;
    const recentRegs = recentRegistrations[event.id] || 0;

    // Score based on total registrations and recent activity
    const score = (totalRegs * 0.3) + (recentRegs * 0.7);

    let reason = '';
    if (recentRegs > 0) {
      reason = `${recentRegs} new registrations this week. `;
    }
    if (totalRegs > 0) {
      reason += `${totalRegs} total registrations.`;
    }

    return {
      id: event.id,
      score,
      reason: reason.trim() || 'New event',
      event
    };
  });

  // Sort by score descending and filter out zero scores
  return trending
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
