/**
 * Participation Types
 * Core types for participant data in the registration system
 */

/** Gender options for participants */
export type ParticipationGender = 'Male' | 'Female';

/** Document types for nationality verification */
export type ParticipationNationality = 'IDCard' | 'BirthCertificate';

/** Participant roles in an event */
export type ParticipationPosition = 'Athlete' | 'Leader' | 'Technical';

/** Organization types (provinces, ministries, or custom) */
export type ParticipationOrganization = 'province' | 'ministry' | string;

/** Position details for a participant */
export interface PositionInfo {
  role: ParticipationPosition;
  coach?: string;
  assistant?: string;
  leaderRole?: string;
  athleteCategory?: ParticipationGender;
}

/** Organization details for a participant */
export interface OrganizationInfo {
  type: ParticipationOrganization;
  id?: string;
  name?: string;
}

/** Base participant data structure */
export interface Participation {
  id: string;
  registeredAt: string | number | Date;
  fullNameKhmer: string;
  fullNameEnglish: string;
  gender: ParticipationGender;
  dateOfBirth: string;
  nationality: ParticipationNationality;
  position: PositionInfo;
  organization: OrganizationInfo;
  photoUrl: string;
  phone: string;
  sports: string[];
  eventId?: string;
}

