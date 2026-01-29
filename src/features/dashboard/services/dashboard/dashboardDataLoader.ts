/**
 * Dashboard Data Loader (Server-side only)
 * Centralized data loading utilities for dashboard feature
 * Focus: Participant and Event Management
 * 
 * WARNING: This file uses Node.js 'fs' module and can only be used in server-side code.
 * For client-side usage, use the /api/dashboard endpoint via useDashboardData hook.
 */

import type {
  DashboardParticipant,
  DashboardAthlete,
  DashboardEvent,
  DashboardSport,
  DashboardProvince
} from '../../types/types'
import { readFileSync } from 'fs'
import path from 'path'

// Import events data (static, doesn't change at runtime)
import eventsData from '@/src/data/mock/events.json'

// Path to registrations file for dynamic reading
const REGISTRATIONS_FILE = path.join(process.cwd(), 'src/data/mock/registrations.json')

/**
 * Read registrations data fresh from file (not cached module import)
 */
function getRegistrationsData(): any[] {
  try {
    const raw = readFileSync(REGISTRATIONS_FILE, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch {
    return []
  }
}

/**
 * Load all dashboard participants from registrations
 * Includes all roles: Athlete, Coach, Leader, Official, etc.
 */
export function loadDashboardParticipants(): DashboardParticipant[] {
  const participants: DashboardParticipant[] = []
  const registrationsData = getRegistrationsData()
  
  registrationsData.forEach((user: any) => {
    user.registrations.forEach((reg: any) => {
      // Include all registrations (not filtered by role)
      participants.push({
        id: reg.id || '',
        name: reg.fullNameEnglish || reg.fullNameKhmer || 'Unknown',
        fullNameKhmer: reg.fullNameKhmer,
        fullNameEnglish: reg.fullNameEnglish,
        province: reg.organization?.province || reg.organization?.name || 'Unknown',
        sport: reg.sport || '',
        sports: reg.sports || [reg.sport || ''],
        sportId: reg.sportId,
        sportCategory: reg.sportCategory,
        status: reg.status || 'pending',
        gender: reg.gender,
        dateOfBirth: reg.dateOfBirth,
        phone: reg.phone,
        eventId: reg.eventId,
        photoUrl: reg.photoUrl || undefined,
        registeredAt: reg.registeredAt,
        nationality: reg.nationality,
        nationalID: reg.nationalID,
        position: reg.position ? {
          role: reg.position.role,
          category: reg.position.athleteCategory || undefined,
          leaderRole: reg.position.leaderRole || undefined,
          coach: reg.position.coach || undefined,
          assistant: reg.position.assistant || undefined
        } : undefined,
        organization: reg.organization ? {
          id: reg.organization.id,
          name: reg.organization.name,
          type: reg.organization.type,
          province: reg.organization.province || undefined,
          department: reg.organization.department || undefined
        } : undefined
      })
    })
  })
  
  return participants
}

/**
 * Load dashboard participants filtered by event
 */
export function loadDashboardParticipantsByEvent(eventId: string): DashboardParticipant[] {
  const participants = loadDashboardParticipants()
  return participants.filter(p => p.eventId === eventId)
}

/**
 * Load all dashboard events from events.json
 */
export function loadDashboardEvents(): DashboardEvent[] {
  return eventsData.map((event: any) => ({
    id: event.id,
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    status: event.status,
    location: event.location,
    description: event.description,
    sports: event.sports?.map((sport: any) => 
      typeof sport === 'string' ? sport : sport.name
    ) || []
  }))
}

/**
 * Load a single event by ID
 */
export function loadDashboardEventById(eventId: string): DashboardEvent | undefined {
  const events = loadDashboardEvents()
  return events.find(event => event.id === eventId)
}

/**
 * Load all dashboard sports from events data
 * Extracts unique sports from all events
 */
export function loadDashboardSports(): DashboardSport[] {
  const sportsMap = new Map<string, DashboardSport>()
  
  eventsData.forEach((event: any) => {
    if (event.sports && Array.isArray(event.sports)) {
      event.sports.forEach((sport: any) => {
        const sportId = sport.id || sport.name?.toLowerCase().replace(/\s+/g, '-') || ''
        const sportName = sport.name || sport
        
        if (sportId && !sportsMap.has(sportId)) {
          // Count participants from registrations
          const participants = loadDashboardParticipants().filter(
            (participant: DashboardParticipant) => participant.sportId === sportId || participant.sport === sportName
          ).length
          
          sportsMap.set(sportId, {
            id: sportId,
            name: sportName,
            category: sport.category || 'General',
            participants: participants,
            status: sport.status || event.status || 'Upcoming',
            description: sport.description
          })
        }
      })
    }
  })
  
  return Array.from(sportsMap.values())
}

/**
 * Calculate province statistics from participants data
 */
export function loadDashboardProvinces(participants?: DashboardParticipant[]): DashboardProvince[] {
  const participantList = participants || loadDashboardParticipants()
  const provincesMap: Record<string, DashboardProvince> = {}

  participantList.forEach((participant) => {
    const provinceName = participant.province || 'Unknown'
    
    if (!provincesMap[provinceName]) {
      provincesMap[provinceName] = {
        name: provinceName,
        participants: 0,
        total: 0
      }
    }

    provincesMap[provinceName].participants += 1
  })

  // Calculate totals
  Object.values(provincesMap).forEach(province => {
    province.total = province.participants
  })

  // Sort by number of participants (descending)
  return Object.values(provincesMap).sort((a, b) => b.participants - a.participants)
}

/**
 * Load complete dashboard data
 */
export function loadDashboardData(eventId?: string) {
  const participants = eventId 
    ? loadDashboardParticipantsByEvent(eventId) 
    : loadDashboardParticipants()
  
  const events = loadDashboardEvents()
  const sports = loadDashboardSports()
  const provinces = loadDashboardProvinces(participants)

  return {
    participants,
    athletes: participants, // Backward compatibility
    events,
    sports,
    provinces
  }
}

/**
 * Get dashboard statistics
 */
export function getDashboardStats(eventId?: string) {
  const data = loadDashboardData(eventId)
  
  return {
    participants: data.participants.length,
    sports: data.sports.length,
    provinces: data.provinces.length,
    events: data.events.length
  }
}
