// Dashboard-specific types for the micro/choschmous dashboard module
// These can be used standalone or extended from the main project types

export interface DashboardAthlete {
  id: string
  name: string
  firstName?: string
  lastName?: string
  firstNameKh?: string
  lastNameKh?: string
  province: string
  sport: string
  sports?: string[]
  sportId?: string
  sportCategory?: string
  status: "Approved" | "Pending" | "Rejected" | "approved" | "pending" | "rejected" | string
  medals: {
    gold: number
    silver: number
    bronze: number
  }
  gender?: string
  dateOfBirth?: string
  photoUrl?: string
  phone?: string
  eventId?: string
  registeredAt?: string
  nationality?: string
  nationalID?: string
  position?: {
    role: string
    athleteCategory?: string
    leaderRole?: string
    coach?: string
    assistant?: string
  }
  organization?: {
    id: string
    name: string
    type: string
    province?: string
    department?: string
  }
}

export interface DashboardEvent {
  id: string
  name: string
  startDate?: string
  endDate?: string
  sports?: Array<{
    id: string
    name: string
    categories?: string[]
    status?: string
  }>
  location?: string
  status?: string
  description?: string
}

export interface DashboardSport {
  id: string
  name: string
  category: string
  participants: string | number
  status: "Ongoing" | "Completed" | "Upcoming" | string
  description?: string
}

export interface DashboardProvince {
  name: string
  gold: number
  silver: number
  bronze: number
  athletes: number
  total: number
}

export interface DashboardMedal {
  id: string
  athleteId: string
  athleteName?: string
  eventId?: string
  event?: string
  sportId?: string
  sportName?: string
  sport?: string
  date?: string
  awardedDate?: string
  medalType: "Gold" | "Silver" | "Bronze" | "gold" | "silver" | "bronze" | string
  province?: string
}

export interface DashboardStats {
  athletes: number
  sports: number
  provinces: number
  medals: number
  events?: number
}

// Re-export for convenience
export type Athlete = DashboardAthlete
export type Event = DashboardEvent
export type SportRecord = DashboardSport
export type Province = DashboardProvince
export type Medal = DashboardMedal
