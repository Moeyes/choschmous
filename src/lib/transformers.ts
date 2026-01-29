/**
 * Data Transformers
 * Centralized transformation logic for converting between data formats
 */

import type { FormData } from '@/src/types/registration'
import type { DashboardParticipant } from '@/src/features/dashboard/types/types'
import { DEFAULTS } from '@/src/config/constants'
import { toISODate, toISODateTime } from './utils'

/**
 * Transform registration FormData to DashboardParticipant format
 */
export function formDataToParticipant(
  formData: FormData,
  photoUrl?: string
): Omit<DashboardParticipant, 'id'> {
  const name = formData.fullNameEnglish || formData.fullNameKhmer || ''
  const sports = formData.sports?.length ? formData.sports : formData.sport ? [formData.sport] : []

  return {
    name,
    fullNameKhmer: formData.fullNameKhmer,
    fullNameEnglish: formData.fullNameEnglish,
    dateOfBirth: formData.dateOfBirth,
    gender: formData.gender === 'Female' ? 'Female' : 'Male',
    nationality: formData.nationality,
    nationalID: formData.nationalID,
    phone: formData.phone,
    photoUrl: photoUrl || DEFAULTS.photoUrl,
    registeredAt: toISODateTime(),
    status: DEFAULTS.status,
    province: formData.organization?.id || formData.organization?.name || '',
    sport: formData.sport || '',
    sports,
    sportId: formData.sportId,
    sportCategory: formData.category ?? formData.sport,
    eventId: formData.eventId ?? undefined,
    position: formData.position ? {
      role: formData.position.role,
      category: formData.position.athleteCategory,
      leaderRole: formData.position.leaderRole,
      coach: formData.position.coach,
      assistant: formData.position.assistant,
    } : undefined,
    organization: formData.organization ? {
      id: formData.organization.id || '',
      name: formData.organization.name || formData.organization.id || '',
      type: formData.organization.type || 'province',
      province: formData.organization.id,
      department: formData.organization.id,
    } : undefined,
  }
}

/**
 * Create minimal participant copy for session storage
 */
export function toSessionParticipant(participant: DashboardParticipant) {
  return {
    id: participant.id,
    fullNameKhmer: participant.fullNameKhmer,
    fullNameEnglish: participant.fullNameEnglish,
    name: participant.name,
    registeredAt: participant.registeredAt,
  }
}
