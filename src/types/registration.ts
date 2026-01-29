/**
 * Registration Types
 * Types for registration forms and validation
 */

import type { ReactNode } from 'react';
import type {
  ParticipationGender,
  ParticipationNationality,
  PositionInfo,
  OrganizationInfo
} from './participation';

/** Registration form data structure */
export interface FormData {
  // Identification
  id?: string;
  registeredAt?: string | number | Date;

  // Personal Information
  fullNameKhmer?: string;
  fullNameEnglish?: string;
  gender?: ParticipationGender;
  dateOfBirth?: string;
  nationality?: ParticipationNationality;
  nationalID?: string;
  phone?: string;
  photoUrl?: string;
  photoUpload?: File | null;

  // Position & Organization
  position?: PositionInfo | null;
  organization?: OrganizationInfo | null;

  // Sport Selection
  sport: string;
  sports: string[];
  selectedSport?: string | string[] | null;
  category?: string;
  sportId?: string;
  sportCategory?: string;
  eventId?: string | null;

  // Local storage reference
  localParticipantId?: {
    accessId: string;
    accessDate: string;
  };
}

/** Form validation errors */
export interface FormErrors {
  // Personal info errors
  fullNameKhmer?: string;
  fullNameEnglish?: string;
  nationalID?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  photoUpload?: string;

  // Organization errors
  organization?: string;

  // Sport errors
  sport?: string;
  sports?: string;
  category?: string;
  selectedSport?: string;

  // Position errors
  position?: string;
}

/** Field change handler type */
export type OnFieldChange = <K extends keyof FormData>(
  field: K,
  value: FormData[K]
) => void;

/** Sport category definition */
export interface SportCategory {
  id: string;
  name: string;
  icon: string;
}

/** Generic select option */
export interface SelectOption {
  value: string;
  label: string;
}

/** Header button props */
export interface HeaderButtonProps {
  variant?: 'primary' | 'outline';
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

/** Form section component props */
export interface FormSectionProps {
  formData: FormData;
  handleChange: OnFieldChange;
  errors?: FormErrors;
}

/** Form input component props */
export interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}

/** Form select component props */
export interface FormSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

/** Activity log entry */
export interface LogEntry {
  id: number;
  action: string;
  timestamp: string;
}