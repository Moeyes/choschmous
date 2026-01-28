import { NextRequest, NextResponse } from 'next/server';
import { recommendEvents } from '@/src/services/recommendation/recommendationEngine';
import events from '@/src/data/mock/events.json';
import type { Event } from '@/src/types';

/**
 * GET /api/recommendations/events
 * Get recommended events for a specific athlete
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const athleteId = searchParams.get('athleteId');
    const sport = searchParams.get('sport');
    // level parameter reserved for future use
    const registeredEventIds = searchParams.get('registered')?.split(',') || [];

    if (!athleteId) {
      return NextResponse.json(
        { error: 'athleteId is required' },
        { status: 400 }
      );
    }

    const athlete = {
      id: athleteId,
      sportCategory: sport || undefined,
      sports: sport ? [sport] : []
    };

    const recommendations = recommendEvents(
      athlete,
      events as Event[],
      registeredEventIds
    );

    return NextResponse.json({
      athleteId,
      recommendations,
      count: recommendations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
