import type { FormData } from '@/types/registration'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function ensureArrayOfStrings(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String)
  return [String(value)]
}

export function normalizeOrganization(org: any) {
  if (!org) return { type: null, province: null, department: null }
  if (typeof org === 'object') {
    return {
      type: org.type ?? null,
      province: org.province ?? null,
      department: org.department ?? null,
    }
  }
  return { type: org, province: null, department: null }
}

export function normalizePosition(pos: any) {
  if (!pos) return { role: null, coach: null, assistant: null }
  if (typeof pos === 'object') {
    return {
      role: pos.role ?? pos ?? null,
      coach: pos.coach ?? null,
      assistant: pos.assistant ?? null,
    }
  }
  return { role: pos ?? null, coach: null, assistant: null }
}


export function normalizeRegistration(body: Partial<FormData>) {
  const sports = ensureArrayOfStrings((body as any).sports ?? (body as any).sport ? (body as any).sports ?? [ (body as any).sport ] : [])
  const primarySport = sports && sports.length ? sports[0] : (body.sport ?? null)
  const category = (body as any).category ?? null
  const sanitizedPhone = typeof body.phone === 'string' ? body.phone.trim() : body.phone ?? null

  return {
    firstName: body.firstName ?? null,
    lastName: body.lastName ?? null,
    firstNameKh: body.firstNameKh ?? null,
    lastNameKh: body.lastNameKh ?? null,
    dateOfBirth: body.dateOfBirth ?? null,
    gender: body.gender ?? null,
    nationality: body.nationality ?? null,
    nationalID: body.nationalID ?? null,
    phone: sanitizedPhone,
    position: normalizePosition((body as any).position),
    organization: normalizeOrganization((body as any).organization),
    eventId: body.eventId ?? null,
    sport: primarySport ?? null,
    sports,
    sportId: primarySport ? slug(String(primarySport)) : null,
    sportCategory: category ?? (body as any).sportCategory ?? null,
    photoUrl: (body as any).photoUrl ?? null,
    ...((body as any).extra ? (body as any).extra : {}),
  } as any
}
