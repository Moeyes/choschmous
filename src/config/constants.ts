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
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
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
  events: "/api/events",
  organizations: "/api/organizations",
  registrations: "/api/registrations",
} as const;

/** Default values */
export const DEFAULTS = {
  photoUrl: "/avatars/default.jpg",
  status: "pending" as const,
  gender: "Male" as const,
} as const;

/** Registration wizard steps */
export const REGISTRATION_STEPS = {
  total: 6,
  eventSelection: 1,
  organizationSelection: 2,
  sportSelection: 3,
  categorySelection: 4,
  personalInfo: 5,
  confirmation: 6,
} as const;

/** Position role options */
export const POSITION_ROLES = {
  athlete: "Athlete",
  leader: "Leader",
  technical: "Technical",
} as const;

/** Leader role options */
export const LEADER_ROLES = [
  { value: "coach", label: "ថ្នាក់ដឹកនាំ" },
  { value: "manager", label: "គណកម្មការបច្ចេកទេស" },
  { value: "delegate", label: "ប្រតិភូ" },
  { value: "team_lead", label: "អ្នកដឹកនាំក្រុម" },
  { value: "coach_trainer", label: "គ្រូបង្វឹក" },
  { value: "teacher_assistant", label: "គ្រូជំនួយ" },
] as const;

/** Get leader role label by value */
export function getLeaderRoleLabel(value: string | undefined): string {
  if (!value) return "មិនមាន";
  const role = LEADER_ROLES.find((r) => r.value === value);
  return role?.label ?? "មិនមាន";
}

/** Gender options */
export const GENDER_OPTIONS = [
  { value: "Male", label: "ប្រុស" },
  { value: "Female", label: "ស្រី" },
] as const;

/** Get gender label by value */
export function getGenderLabel(value: string | undefined): string {
  if (!value) return "មិនមាន";
  const gender = GENDER_OPTIONS.find((g) => g.value === value);
  return gender?.label ?? "មិនមាន";
}

/** Nationality document options */
export const NATIONALITY_OPTIONS = [
  { value: "IDCard", label: "អត្តសញ្ញាណប័ណ្ណ" },
  { value: "BirthCertificate", label: "វិញ្ញាបនបត្រកំណើត" },
] as const;

/** Get nationality label by value */
export function getNationalityLabel(value: string | undefined): string {
  if (!value) return "មិនមាន";
  const nationality = NATIONALITY_OPTIONS.find((n) => n.value === value);
  return nationality?.label ?? "មិនមាន";
}

/** Participant status values */
export const PARTICIPANT_STATUS = {
  approved: "approved",
  pending: "pending",
  rejected: "rejected",
} as const;

/** Status labels in Khmer */
export const STATUS_LABELS = {
  approved: "អនុម័ត",
  pending: "កំពុងរងចាំ",
  rejected: "បដិសេធ",
  active: "សកម្ម",
  inactive: "អសកម្ម",
  completed: "បានបញ្ចប់",
  upcoming: "នឹងមកដល់",
  ongoing: "កំពុងដំណើរការ",
} as const;

/** Get status label by value */
export function getStatusLabel(value: string | undefined): string {
  if (!value) return "មិនមាន";
  return STATUS_LABELS[value as keyof typeof STATUS_LABELS] ?? value;
}

/** Status colors (Tailwind classes) */
export const STATUS_COLORS = {
  approved: "bg-emerald-500 hover:bg-emerald-600 text-white",
  pending: "bg-yellow-500 hover:bg-yellow-600 text-white",
  rejected: "bg-red-500 hover:bg-red-600 text-white",
  active: "bg-blue-500 hover:bg-blue-600 text-white",
  inactive: "bg-gray-400 hover:bg-gray-500 text-white",
  completed: "bg-green-600 hover:bg-green-700 text-white",
  upcoming: "bg-indigo-500 hover:bg-indigo-600 text-white",
  ongoing: "bg-orange-500 hover:bg-orange-600 text-white",
} as const;

/** Event status values */
export const EVENT_STATUS = {
  upcoming: "upcoming",
  ongoing: "ongoing",
  completed: "completed",
} as const;

/** Icon sizes (Tailwind classes) */
export const ICON_SIZES = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
  "2xl": "h-10 w-10",
} as const;

/** Button sizes (Tailwind classes) */
export const BUTTON_SIZES = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-lg",
} as const;

/** Application routes */
export const ROUTES = {
  home: "/",
  register: "/register",
  dashboard: {
    root: "/dashboard",
    participants: "/dashboard/participants",
    events: "/dashboard/events",
    sports: "/dashboard/sports",
    provinces: "/dashboard/provinces",
  },
} as const;

/** Registration step query parameters */
export const REGISTRATION_STEP_PARAMS = {
  event: "event",
  organization: "organization",
  sport: "sport",
  category: "category",
  personal: "personal",
  confirm: "confirm",
  success: "success",
} as const;

/** Registration step labels */
export const REGISTRATION_STEP_LABELS = {
  event: "ជ្រើសរើសព្រឹត្តិការណ៍",
  organization: "ជ្រើសរើសអង្គភាព",
  sport: "ជ្រើសរើសកីឡា",
  category: "ជ្រើសរើសប្រភេទ",
  personal: "ព័ត៌មានផ្ទាល់ខ្លួន",
  confirm: "បញ្ជាក់ការចុះឈ្មោះ",
  success: "ជោគជ័យ",
} as const;

/** Position role labels */
export const ROLE_LABELS = {
  Athlete: "កីឡាករ/កីឡាការិនី",
  Leader: "អ្នកដឹកនាំ",
  Coach: "គ្រូបង្វឹក",
  Official: "មន្ត្រី",
  Technical: "បច្ចេកទេស",
} as const;

/** Athlete category labels */
export const ATHLETE_CATEGORY_LABELS = {
  Male: "កីឡាករ",
  Female: "កីឡាការិនី",
} as const;

/** Empty state messages */
export const EMPTY_MESSAGES = {
  participants: {
    title: "មិនមានអ្នកចូលរួម",
    description: "មិនទាន់មានអ្នកចូលរួមណាត្រូវបានចុះឈ្មោះនៅឡើយទេ",
  },
  sports: {
    title: "មិនមានកីឡា",
    description: "មិនទាន់មានកីឡាណាត្រូវបានបន្ថែមនៅឡើយទេ",
  },
  events: {
    title: "មិនមានព្រឹត្តិការណ៍",
    description: "មិនទាន់មានព្រឹត្តិការណ៍ណាត្រូវបានបង្កើតនៅឡើយទេ",
  },
  provinces: {
    title: "មិនមានខេត្ត",
    description: "មិនទាន់មានទិន្នន័យខេត្តនៅឡើយទេ",
  },
  search: {
    title: "រកមិនឃើញ",
    description: "គ្មានលទ្ធផលត្រូវនឹងការស្វែងរករបស់អ្នក",
  },
} as const;

/** Error messages */
export const ERROR_MESSAGES = {
  required: "វាលនេះត្រូវតែបំពេញ",
  invalidEmail: "អ៊ីមែលមិនត្រឹមត្រូវ",
  invalidPhone: "លេខទូរស័ព្ទមិនត្រឹមត្រូវ",
  invalidDate: "កាលបរិច្ឆេទមិនត្រឹមត្រូវ",
  fileTooLarge: "ឯកសារធំពេក",
  invalidFileType: "ប្រភេទឯកសារមិនត្រឹមត្រូវ",
  uploadFailed: "បរាជ័យក្នុងការផ្ទុកឡើង",
  networkError: "មានបញ្ហាក្នុងការតភ្ជាប់បណ្តាញ",
  serverError: "មានបញ្ហាលើម៉ាស៊ីនមេ",
  selectRequired: "សូមជ្រើសរើសយ៉ាងហោចណាស់មួយ",
} as const;

/** Animation durations (ms) */
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/** Debounce delays (ms) */
export const DEBOUNCE_MS = {
  search: 300,
  resize: 150,
  input: 500,
} as const;

/** Recommendation refresh intervals (in ms) */
export const REFRESH_INTERVALS = {
  trending: 30 * 60 * 1000, // 30 minutes
  dashboard: 5 * 60 * 1000, // 5 minutes
} as const;
