// Dashboard-specific types for the micro/choschmous dashboard module
// Focus: Participant and Event Management

export interface DashboardParticipant {
  id: string
  name: string
  fullNameKhmer?: string
  fullNameEnglish?: string
  province: string
  sport: string
  sports?: string[]
  sportId?: string
  sportCategory?: string
  status: "Approved" | "Pending" | "Rejected" | "approved" | "pending" | "rejected" | string
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
    category?: string
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

// Keep DashboardAthlete as alias for backward compatibility
export type DashboardAthlete = DashboardParticipant

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
  participants: number
  total: number
}

export interface DashboardStats {
  participants: number
  sports: number
  provinces: number
  events?: number
}

// Re-export for convenience
export type Participant = DashboardParticipant
export type Event = DashboardEvent
export type SportRecord = DashboardSport
export type Province = DashboardProvince

