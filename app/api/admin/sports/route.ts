import { NextResponse } from "next/server";
import eventsData from "@/src/data/mock/events.json";

export async function GET() {
  const sportsMap = new Map();

  (eventsData as any[]).forEach((event) => {
    (event.sports || []).forEach((sport: any) => {
      const id = sport.id || String(sport).toLowerCase().replace(/\s+/g, "-");
      const name = sport.name || sport;
      if (!sportsMap.has(id)) {
        sportsMap.set(id, {
          id,
          name,
          category: sport.category || "General",
          participants: 0,
          status: sport.status || event.status || "Upcoming",
          description: sport.description,
        });
      }
    });
  });

  return NextResponse.json(Array.from(sportsMap.values()));
}
