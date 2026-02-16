import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

import type {
  DashboardParticipant,
  DashboardEvent,
  DashboardSport,
  DashboardProvince,
} from "@/src/features/dashboard/types/types";

// Import events data (static)
import eventsData from "@/data/mock/events.json";

const REGISTRATIONS_FILE = path.join(
  process.cwd(),
  "src/data/mock/registrations.json",
);

/**
 * Read registrations data fresh from file
 */
async function getRegistrationsData(): Promise<any[]> {
  try {
    const raw = await fs.readFile(REGISTRATIONS_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

/**
 * Load all dashboard participants from registrations
 * Includes all roles: Athlete, Coach, Leader, Official, etc.
 */
async function loadDashboardParticipants(): Promise<DashboardParticipant[]> {
  const participants: DashboardParticipant[] = [];
  const registrationsData = await getRegistrationsData();

  registrationsData.forEach((user: any) => {
    user.registrations?.forEach((reg: any) => {
      // Include all registrations (not filtered by role)
      participants.push({
        id: reg.id || "",
        name: reg.fullNameEnglish || reg.fullNameKhmer || "Unknown",
        fullNameKhmer: reg.fullNameKhmer,
        fullNameEnglish: reg.fullNameEnglish,
        province:
          reg.organization?.province || reg.organization?.name || "Unknown",
        sport: reg.sport || "",
        sports: reg.sports || [reg.sport || ""],
        sportId: reg.sportId,
        sportCategory: reg.sportCategory || reg.category,
        status: reg.status || "pending",
        gender: reg.gender,
        dateOfBirth: reg.dateOfBirth,
        phone: reg.phone,
        eventId: reg.eventId,
        photoUrl: reg.photoUrl || undefined,
        registeredAt: reg.registeredAt,
        nationality: reg.nationality,
        nationalID: reg.nationalID,
        position: reg.position
          ? {
              role: reg.position.role,
              category: reg.position.athleteCategory || undefined,
              leaderRole: reg.position.leaderRole || undefined,
              coach: reg.position.coach || undefined,
              assistant: reg.position.assistant || undefined,
            }
          : undefined,
        organization: reg.organization
          ? {
              id: reg.organization.id,
              name: reg.organization.name,
              type: reg.organization.type,
              province: reg.organization.province || undefined,
              department: reg.organization.department || undefined,
            }
          : undefined,
      });
    });
  });

  return participants;
}

/**
 * Load dashboard participants filtered by event
 */
async function loadDashboardParticipantsByEvent(
  eventId: string,
): Promise<DashboardParticipant[]> {
  const participants = await loadDashboardParticipants();
  return participants.filter((p) => p.eventId === eventId);
}

/**
 * Load all dashboard events from events.json
 */
function loadDashboardEvents(): DashboardEvent[] {
  return eventsData.map((event: any) => ({
    id: event.id,
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    status: event.status,
    location: event.location,
    description: event.description,
    sports:
      event.sports?.map((sport: any) =>
        typeof sport === "string" ? sport : sport.name,
      ) || [],
  }));
}

/**
 * Load all dashboard sports from events data
 */
async function loadDashboardSports(): Promise<DashboardSport[]> {
  const sportsMap = new Map<string, DashboardSport>();
  const participants = await loadDashboardParticipants();

  eventsData.forEach((event: any) => {
    if (event.sports && Array.isArray(event.sports)) {
      event.sports.forEach((sport: any) => {
        const sportId =
          sport.id || sport.name?.toLowerCase().replace(/\s+/g, "-") || "";
        const sportName = sport.name || sport;

        if (sportId && !sportsMap.has(sportId)) {
          const count = participants.filter(
            (p: DashboardParticipant) =>
              p.sportId === sportId || p.sport === sportName,
          ).length;

          sportsMap.set(sportId, {
            id: sportId,
            name: sportName,
            category: sport.category || "General",
            participants: count,
            status: sport.status || event.status || "Upcoming",
            description: sport.description,
          });
        }
      });
    }
  });

  return Array.from(sportsMap.values());
}

/**
 * Calculate province statistics from participants data
 */
function loadDashboardProvinces(
  participants: DashboardParticipant[],
): DashboardProvince[] {
  const provincesMap: Record<string, DashboardProvince> = {};

  participants.forEach((participant) => {
    const provinceName = participant.province || "Unknown";

    if (!provincesMap[provinceName]) {
      provincesMap[provinceName] = {
        name: provinceName,
        participants: 0,
        total: 0,
      };
    }

    provincesMap[provinceName].participants += 1;
  });

  // Calculate totals
  Object.values(provincesMap).forEach((province) => {
    province.total = province.participants;
  });

  // Sort by number of participants (descending)
  return Object.values(provincesMap).sort(
    (a, b) => b.participants - a.participants,
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  try {
    const participants = eventId
      ? await loadDashboardParticipantsByEvent(eventId)
      : await loadDashboardParticipants();

    const events = loadDashboardEvents();
    const sports = await loadDashboardSports();
    const provinces = loadDashboardProvinces(participants);

    return NextResponse.json({
      participants,
      athletes: participants, // Backward compatibility
      events,
      sports,
      provinces,
      stats: {
        participants: participants.length,
        sports: sports.length,
        provinces: provinces.length,
        events: events.length,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 },
    );
  }
}
