/**
 * Dashboard Data Loader
 * Centralized data loading utilities for dashboard feature
 * Uses existing data sources (events.json, registrations.json)
 */

import type { 
  DashboardAthlete, 
  DashboardEvent, 
  DashboardSport,
  DashboardProvince 
} from '@/components/features/dashboard/types'

// Import existing data files
import eventsData from '../mock/events.json'
import registrationsData from '../mock/registrations.json'

/**
 * Load all dashboard athletes from registrations where position.role = "Athlete"
 */
export function loadDashboardAthletes(): DashboardAthlete[] {
  const athletes: DashboardAthlete[] = []
  
  registrationsData.forEach((user) => {
    user.registrations.forEach((reg) => {
      // Only include registrations where role is "Athlete"
      if (reg.position?.role === 'Athlete') {
        athletes.push({
          id: reg.id || '',
          name: `${reg.firstName} ${reg.lastName}`,
          firstName: reg.firstName,
          lastName: reg.lastName,
          firstNameKh: reg.firstNameKh,
          lastNameKh: reg.lastNameKh,
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
            athleteCategory: reg.position.athleteCategory || undefined,
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
          } : undefined,
          medals: { gold: 0, silver: 0, bronze: 0 } // No medal data yet
        })
      }
    })
  })
  
  return athletes
}

/**
 * Load dashboard athletes filtered by event
 */
export function loadDashboardAthletesByEvent(eventId: string): DashboardAthlete[] {
  const athletes = loadDashboardAthletes()
  return athletes.filter(athlete => athlete.eventId === eventId)
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
          const participants = loadDashboardAthletes().filter(
            athlete => athlete.sportId === sportId || athlete.sport === sportName
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
 * Calculate province statistics from athletes data
 */
export function loadDashboardProvinces(athletes?: DashboardAthlete[]): DashboardProvince[] {
  const athleteList = athletes || loadDashboardAthletes()
  const provincesMap: Record<string, DashboardProvince> = {}

  athleteList.forEach((athlete) => {
    const provinceName = athlete.province || 'Unknown'
    
    if (!provincesMap[provinceName]) {
      provincesMap[provinceName] = {
        name: provinceName,
        gold: 0,
        silver: 0,
        bronze: 0,
        athletes: 0,
        total: 0
      }
    }

    const medals = athlete.medals ?? { gold: 0, silver: 0, bronze: 0 }
    provincesMap[provinceName].gold += medals.gold
    provincesMap[provinceName].silver += medals.silver
    provincesMap[provinceName].bronze += medals.bronze
    provincesMap[provinceName].athletes += 1
  })

  // Calculate totals
  Object.values(provincesMap).forEach(province => {
    province.total = province.gold + province.silver + province.bronze
  })

  // Sort by number of athletes (descending) since we don't have medal data yet
  return Object.values(provincesMap).sort((a, b) => b.athletes - a.athletes)
}

/**
 * Load complete dashboard data
 */
export function loadDashboardData(eventId?: string) {
  const athletes = eventId 
    ? loadDashboardAthletesByEvent(eventId) 
    : loadDashboardAthletes()
  
  const events = loadDashboardEvents()
  const sports = loadDashboardSports()
  const provinces = loadDashboardProvinces(athletes)

  return {
    athletes,
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
    athletes: data.athletes.length,
    sports: data.sports.length,
    provinces: data.provinces.length,
    medals: 0, // No medal tracking yet
    events: data.events.length
  }
}
