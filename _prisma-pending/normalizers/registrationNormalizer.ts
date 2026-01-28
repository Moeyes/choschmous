/**
 * Registration Normalizer (Database Version)
 * 
 * Note: This module is prepared for future database integration.
 * Currently the app uses JSON mock files via lib/data/normalizers/registrationNormalizer.ts
 */

// Placeholder interface until Prisma schema is populated
interface Registration {
  id: string;
  registeredAt: Date;
  firstName: string;
  lastName: string;
  firstNameKh?: string | null;
  lastNameKh?: string | null;
  dateOfBirth: Date;
  gender: string;
  nationalityType: string;
  nationalId: string;
  phone?: string | null;
  photoUrl?: string | null;
  role: string;
  coachType?: string | null;
  assistantType?: string | null;
  leaderRole?: string | null;
  athleteCategory?: string | null;
  organizationId: string;
  eventId: string;
  sportId: string;
  sportCategoryId?: string | null;
  status: string;
  approvedAt?: Date | null;
}

/**
 * Normalize form data to database-ready registration input
 */
export function normalizeRegistration(formData: Record<string, unknown>): Partial<Registration> & Record<string, unknown> {
  const dateOfBirth = formData.dateOfBirth 
    ? new Date(formData.dateOfBirth as string) 
    : undefined;

  return {
    // Personal Info
    firstName: formData.firstName as string,
    lastName: formData.lastName as string,
    firstNameKh: formData.firstNameKh as string | undefined,
    lastNameKh: formData.lastNameKh as string | undefined,
    dateOfBirth,
    gender: formData.gender as string,

    // Identification
    nationalityType: formData.nationality as string || 'IDCard',
    nationalId: formData.nationalID as string,
    phone: formData.phone as string | undefined,
    photoUrl: formData.photoUrl as string | undefined,

    // Position
    role: formData.role as string || 'Athlete',
    coachType: formData.coach as string | undefined,
    assistantType: formData.assistant as string | undefined,
    leaderRole: formData.leaderRole as string | undefined,
    athleteCategory: formData.athleteCategory as string || (formData.gender as string),

    // References (these need to be resolved to UUIDs in the API)
    organizationId: formData.organizationId as string,
    eventId: formData.eventId as string,
    sportId: formData.sportId as string,
    sportCategoryId: formData.sportCategoryId as string | undefined,

    // Status
    status: 'pending',
  };
}

/**
 * Transform database registration to API response format
 */
export function toApiResponse(registration: Registration & {
  organization?: { code: string; type: string; nameKh: string; provinceKh?: string | null; departmentKh?: string | null };
  event?: { code: string; nameKh: string };
  sport?: { code: string; nameKh: string };
  sportCategory?: { nameKh: string } | null;
}) {
  return {
    id: registration.id,
    registeredAt: registration.registeredAt.toISOString(),
    
    // Personal Info
    firstName: registration.firstName,
    lastName: registration.lastName,
    firstNameKh: registration.firstNameKh,
    lastNameKh: registration.lastNameKh,
    dateOfBirth: registration.dateOfBirth.toISOString().split('T')[0],
    gender: registration.gender,
    
    // Identification
    nationality: registration.nationalityType,
    nationalID: registration.nationalId,
    phone: registration.phone,
    photoUrl: registration.photoUrl,
    
    // Position (legacy format for compatibility)
    position: {
      role: registration.role,
      coach: registration.coachType,
      assistant: registration.assistantType,
      leaderRole: registration.leaderRole,
      athleteCategory: registration.athleteCategory,
    },
    
    // Organization (expanded for legacy compatibility)
    organization: registration.organization ? {
      type: registration.organization.type,
      id: registration.organization.code,
      name: registration.organization.nameKh,
      province: registration.organization.provinceKh,
      department: registration.organization.departmentKh,
    } : null,
    
    // Event & Sport
    eventId: registration.event?.code || registration.eventId,
    sport: registration.sport?.code,
    sportId: registration.sport?.code || registration.sportId,
    sportCategory: registration.sportCategory?.nameKh,
    
    // Status
    status: registration.status,
    approvedAt: registration.approvedAt?.toISOString(),
  };
}
