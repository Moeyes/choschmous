/**
 * Application Constants
 * Centralized constants for the application
 */

/** Validation patterns */
export const PATTERNS = {
  phone: /^\+?[0-9\s\-()]{7,15}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  numeric: /^[0-9]+$/,
} as const;

/** File upload limits */
export const UPLOAD_LIMITS = {
  maxImageSize: 2 * 1024 * 1024, // 2MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

/** Photo dimensions */
export const PHOTO_DIMENSIONS = {
  width: 600,
  height: 900,
} as const;

/** Responsive breakpoints */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

/** API endpoints */
export const API_ENDPOINTS = {
  events: '/api/events',
  organizations: '/api/organizations',
  registrations: '/api/registrations',
  recommendations: {
    events: '/api/recommendations/events',
    trending: '/api/recommendations/trending',
  },
} as const;

/** Registration wizard steps */
export const REGISTRATION_STEPS = {
  total: 6,
  eventSelection: 1,
  sportSelection: 2,
  categorySelection: 3,
  organizationSelection: 4,
  personalInfo: 5,
  confirmation: 6,
} as const;

/** Position role options */
export const POSITION_ROLES = {
  athlete: 'Athlete',
  leader: 'Leader',
  technical: 'Technical',
} as const;

/** Leader role options */
export const LEADER_ROLES = [
  { value: 'coach', label: 'ថ្នាក់ដឹកនាំ' },
  { value: 'manager', label: 'គណកម្មការបច្ចេកទេស' },
  { value: 'delegate', label: 'ប្រតិភូ' },
  { value: 'team_lead', label: 'អ្នកដឹកនាំក្រុម' },
  { value: 'coach_trainer', label: 'គ្រូបង្វឹក' },
] as const;

/** Gender options */
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'ប្រុស' },
  { value: 'Female', label: 'ស្រី' },
] as const;

/** Nationality document options */
export const NATIONALITY_OPTIONS = [
  { value: 'IDCard', label: 'អត្តសញ្ញាណប័ណ្ណ' },
  { value: 'BirthCertificate', label: 'វិញ្ញាបនបត្រកំណើត' },
] as const;

/** Event status values */
export const EVENT_STATUS = {
  upcoming: 'upcoming',
  ongoing: 'ongoing',
  completed: 'completed',
} as const;

/** Recommendation refresh intervals (in ms) */
export const REFRESH_INTERVALS = {
  trending: 30 * 60 * 1000, // 30 minutes
} as const;
