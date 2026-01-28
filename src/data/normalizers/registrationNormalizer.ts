import type { FormData as RegistrationFormData } from '@/src/types/registration'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function ensureArrayOfStrings(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String)
  return [String(value)]
}

/** Input type for organization normalization */
interface RawOrganization {
  type?: string | null;
  id?: string | null;
  name?: string | null;
  province?: string | null;
  department?: string | null;
}

/** Normalized organization output */
interface NormalizedOrganization {
  type: string | null;
  id: string | null;
  name: string | null;
  province: string | null;
  department: string | null;
}

export function normalizeOrganization(org: RawOrganization | string | null | undefined): NormalizedOrganization {
  if (!org) return { type: null, id: null, name: null, province: null, department: null }
  if (typeof org === 'string') {
    return { type: org, id: null, name: null, province: null, department: null }
  }
  
  // Generate ID from existing id, or slugify province/name, or use timestamp
  let orgId = org.id ?? null
  if (!orgId && org.province) {
    orgId = slug(org.province) || `org-${Date.now()}`
  } else if (!orgId && org.name) {
    orgId = slug(org.name) || `org-${Date.now()}`
  }
  
  return {
    type: org.type ?? null,
    id: orgId,
    name: org.name ?? org.province ?? null,
    province: org.province ?? null,
    department: org.department ?? null,
  }
}

/** Input type for position normalization */
interface RawPosition {
  role?: string | null;
  coach?: string | null;
  assistant?: string | null;
  leaderRole?: string | null;
  athleteCategory?: string | null;
}

/** Normalized position output */
interface NormalizedPosition {
  role: string | null;
  coach: string | null;
  assistant: string | null;
  leaderRole: string | null;
  athleteCategory: string | null;
}

export function normalizePosition(pos: RawPosition | string | null | undefined): NormalizedPosition {
  if (!pos) return { role: null, coach: null, assistant: null, leaderRole: null, athleteCategory: null }
  if (typeof pos === 'string') {
    return { role: pos, coach: null, assistant: null, leaderRole: null, athleteCategory: null }
  }
  return {
    role: pos.role ?? null,
    coach: pos.coach ?? null,
    assistant: pos.assistant ?? null,
    leaderRole: pos.leaderRole ?? null,
    athleteCategory: pos.athleteCategory ?? null,
  }
}

/** Extended form data with additional fields that may come from API */
interface ExtendedFormData extends Partial<RegistrationFormData> {
  sports?: string[];
  category?: string;
  sportCategory?: string;
  photoUrl?: string;
  status?: string;
  extra?: Record<string, unknown>;
}

/** Normalized registration output */
export interface NormalizedRegistration {
  firstName: string | null;
  lastName: string | null;
  firstNameKh: string | null;
  lastNameKh: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  nationality: string | null;
  nationalID: string | null;
  phone: string | null;
  position: NormalizedPosition;
  organization: NormalizedOrganization;
  eventId: string | null;
  sport: string | null;
  sports: string[];
  sportId: string | null;
  sportCategory: string | null;
  photoUrl: string | null;
  status: string;
  [key: string]: unknown;
}

export function normalizeRegistration(body: ExtendedFormData): NormalizedRegistration {
  const sports = ensureArrayOfStrings(body.sports ?? (body.sport ? [body.sport] : []))
  const primarySport = sports.length > 0 ? sports[0] : (body.sport ?? null)
  const category = body.category ?? null
  const sanitizedPhone = typeof body.phone === 'string' ? body.phone.trim() : body.phone ?? null
  const gender = body.gender ?? null

  // Normalize position with athlete category based on gender
  const position = normalizePosition(body.position as RawPosition | string | undefined)
  if (position.role === 'Athlete' && gender && !position.athleteCategory) {
    position.athleteCategory = gender
  }

  const baseResult: NormalizedRegistration = {
    firstName: body.firstName ?? null,
    lastName: body.lastName ?? null,
    firstNameKh: body.firstNameKh ?? null,
    lastNameKh: body.lastNameKh ?? null,
    dateOfBirth: body.dateOfBirth ?? null,
    gender,
    nationality: body.nationality ?? null,
    nationalID: body.nationalID ?? null,
    phone: sanitizedPhone,
    position,
    organization: normalizeOrganization(body.organization as RawOrganization | undefined),
    eventId: body.eventId ?? null,
    sport: primarySport,
    sports,
    sportId: primarySport ? slug(String(primarySport)) : null,
    sportCategory: category ?? body.sportCategory ?? null,
    photoUrl: body.photoUrl ?? null,
    status: body.status ?? 'pending',
  }

  // Merge any extra fields
  if (body.extra) {
    return { ...baseResult, ...body.extra }
  }

  return baseResult
}
