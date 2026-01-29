/**
 * Data Writer Utilities
 * Handles adding, updating, and deleting data via API
 */

import { api } from '@/src/lib/api'
import type { Sport } from '@/src/types'
import type { DashboardParticipant } from '@/src/features/dashboard/types/types'

type Participant = DashboardParticipant

// Participant operations
export const addParticipant = (data: Omit<Participant, 'id'>) => 
  api.post<Participant>('/api/participants', data)

export const updateParticipant = (id: string, data: Partial<Participant>) => 
  api.put<Participant>(`/api/participants/${id}`, data)

export const deleteParticipant = (id: string) => 
  api.delete(`/api/participants/${id}`)

// Sport operations
export const addSport = (data: Omit<Sport, 'id'>) => 
  api.post<Sport>('/api/sports', data)

export const updateSport = (id: string, data: Partial<Sport>) => 
  api.put<Sport>(`/api/sports/${id}`, data)

export const deleteSport = (id: string) => 
  api.delete(`/api/sports/${id}`)
