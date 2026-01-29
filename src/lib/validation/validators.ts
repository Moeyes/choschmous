/**
 * Form Validation Utilities
 * Centralized validation logic for forms
 */

import type { FormData, FormErrors } from '@/src/types/registration';
import { PATTERNS, UPLOAD_LIMITS } from '@/src/config/constants';

/**
 * Validate a single email address
 */
export function isValidEmail(email: string): boolean {
  return PATTERNS.email.test(email);
}

/**
 * Validate a phone number
 */
export function isValidPhone(phone: string): boolean {
  return PATTERNS.phone.test(phone);
}

/**
 * Validate a date is not in the future
 */
export function isValidPastDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date <= new Date();
}

/**
 * Check if a string meets minimum length
 */
export function hasMinLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

/**
 * Check if a string is within length range
 */
export function isWithinLength(value: string, min: number, max: number): boolean {
  const len = value.trim().length;
  return len >= min && len <= max;
}

/**
 * Validate the registration form
 */
export function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  // Required text fields - at least one full name is required
  if (!data.fullNameKhmer?.trim() && !data.fullNameEnglish?.trim()) {
    errors.fullNameKhmer = 'សូមបញ្ចូលឈ្មោះពេញជាភាសាខ្មែរ។';
    errors.fullNameEnglish = 'សូមបញ្ចូលឈ្មោះពេញជាភាសាអង់គ្លេស។';
  }

  // Phone validation
  const phoneValue = data.phone?.trim();
  if (!phoneValue) {
    errors.phone = 'សូមបញ្ចូលលេខទូរស័ព្ទ។';
  } else if (!isValidPhone(phoneValue)) {
    errors.phone = 'សូមបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវ (7–15 ខ្ទង់).';
  }

  // Date of birth validation
  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'សូមបញ្ចូលថ្ងៃខែឆ្នាំកំណើត។';
  } else if (!isValidPastDate(data.dateOfBirth)) {
    errors.dateOfBirth = 'ថ្ងៃកំណើតត្រូវតែជាកាលបរិច្ឆេទមុនថ្ងៃនេះ។';
  }

  // Organization validation (province/ministry unified)
  // Accept both the new unified organization (id) or legacy fields
  const orgType = String(data.organization?.type ?? '').toLowerCase();
  const hasOrg = !!(data.organization?.id || data.organization?.id || data.organization?.type || data.organization?.name);
  if (orgType === 'province' && !hasOrg) {
    errors.organization = 'សូមជ្រើសរើសអង្គភាព។';
  }

  // National ID validation
  if (!data.nationalID?.trim()) {
    errors.nationalID = 'សូមបញ្ចូលលេខអត្តសញ្ញាណជាតិ។';
  } else if (!isWithinLength(data.nationalID, 6, 20)) {
    errors.nationalID = 'លេខអត្តសញ្ញាណត្រូវមានចន្លោះពី 6 ទៅ 20 តួអក្សរ។';
  }

  if (!data.sport && !data.selectedSport) {
    errors.selectedSport = 'សូមជ្រើសរើសកីឡា។';
    errors.sport = 'សូមជ្រើសរើសកីឡា។';
  }

  if (!(data.position && data.position.role)) {
    errors.position = 'សូមជ្រើសរើសតួនាទី។';
  } else if (data.position.role === 'Athlete' && !data.position.athleteCategory) {
    errors.position = 'សូមជ្រើសប្រភេទកីឡាករ។';
  } else if (data.position.role === 'Leader' && !data.position.leaderRole) {
    errors.position = 'សូមជ្រើសតួនាទីសម្រាប់អ្នកដឹកនាំ។';
  }

  if (data.photoUpload) {
    const file = data.photoUpload;
    
    if (!file.type.startsWith('image/')) {
      errors.photoUpload = 'សូមផ្ទុកឡើងឯកសាររូបភាពតែប៉ុណ្ណោះ (JPG, PNG, ...).';
    } else if (file.size > UPLOAD_LIMITS.maxImageSize) {
      errors.photoUpload = 'ទំហំរូបភាពត្រូវតែ 2MB ឬតូចជាង។';
    }
  }

  return errors;
}

/**
 * Check if form has any errors
 */
export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
