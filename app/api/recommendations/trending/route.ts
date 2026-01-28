import { NextResponse } from 'next/server';
import { getTrendingEvents } from '@/src/services/recommendation/recommendationEngine';
import events from '@/src/data/mock/events.json';
import registrations from '@/src/data/mock/registrations.json';
import type { Event } from '@/src/types';

interface RegistrationRecord {
  id: string;
  eventId?: string;
  registeredAt?: string;
  [key: string]: unknown;
}

/**
 * GET /api/recommendations/trending
 * Get trending events based on registration count and recency
 */
export async function GET() {
  try {
    const trendingEvents = getTrendingEvents(
      events as Event[],
      registrations as unknown as RegistrationRecord[]
    );

    return NextResponse.json({
      trending: trendingEvents,
      count: trendingEvents.length,
      timestamp: new Date().toISOString(),
      cacheControl: 'max-age=3600' // Cache for 1 hour
    });
  } catch (error) {
    console.error('Error getting trending events:', error);
    return NextResponse.json(
      { error: 'Failed to get trending events' },
      { status: 500 }
    );
  }
}
