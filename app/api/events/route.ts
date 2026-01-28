import { NextResponse } from "next/server";
import type { Event } from "@/src/types/event";
import type { SportRecord, SportStatus } from "@/src/types/sport";
import eventsFromFile from "@/src/data/mock/events.json";

/** Raw sport data from JSON or API */
interface RawSport {
  id?: string;
  name?: string;
  categories?: string[];
  category?: string | string[];
  status?: SportStatus;
}

/** Raw event data from JSON */
interface RawEvent {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  status?: string;
  sports?: (string | RawSport)[];
}

// Helper: simple slug generator
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function normalizeSport(s: string | RawSport | null | undefined): SportRecord | null {
  if (!s) return null;
  if (typeof s === "string")
    return { id: slug(s), name: s, categories: [], status: "Upcoming" };
  return {
    id: s.id ?? slug(s.name ?? String(s)),
    name: s.name ?? String(s),
    categories:
      s.categories ??
      (s.category
        ? Array.isArray(s.category)
          ? s.category
          : [s.category]
        : []),
    status: s.status ?? "Upcoming",
  };
}

// Initialize in-memory store from JSON file and normalize shape
const EVENTS: Event[] = (eventsFromFile as RawEvent[]).map((e) => ({
  id: e.id ?? String(Date.now()),
  name: e.name,
  startDate: e.startDate,
  endDate: e.endDate,
  status: e.status,
  sports: Array.isArray(e.sports)
    ? e.sports.map((s) => normalizeSport(s)).filter((s): s is SportRecord => s !== null)
    : [],
}))

export async function GET() {
  return NextResponse.json(EVENTS);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<RawEvent>;
  const id = String(Date.now());
  const created: Event = {
    id,
    name: body.name ?? "",
    startDate: body.startDate ?? "",
    endDate: body.endDate ?? "",
    status: body.status,
    sports: Array.isArray(body.sports)
      ? body.sports.map((s) => normalizeSport(s)).filter((s): s is SportRecord => s !== null)
      : [],
  };
  EVENTS.push(created);
  return new Response(JSON.stringify(created), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
