/**
 * Display Helpers
 * Utilities for formatting values for display
 */

export const GENDER_MAP: Record<string, string> = {
  Male: "ប្រុស",
  Female: "ស្រី",
}

export const ROLE_MAP: Record<string, string> = {
  Athlete: "អត្តពលិក",
  Coach: "គ្រូបង្វឹក",
  Leader: "ប្រធាន",
  Official: "មន្រ្តី",
}

export const LEADER_ROLES_MAP: Record<string, string> = {
  coach: "ថ្នាក់ដឹកនាំ",
  manager: "គណកម្មការបច្ចេកទេស",
  delegate: "ប្រតិភូ",
  team_lead: "អ្នកដឹកនាំក្រុម",
  coach_trainer: "គ្រូបង្វឹក",
}

export const NATIONALITY_MAP: Record<string, string> = {
  IDCard: "អត្តសញ្ញាណប័ណ្ណ",
  BirthCertificate: "វិញ្ញាបនបត្រកំណើត",
}

export const getGenderDisplay = (gender?: string) => 
  gender ? GENDER_MAP[gender] ?? gender : ""

export const getRoleDisplay = (role?: string) => 
  role ? ROLE_MAP[role] ?? role : ""

export const getLeaderRoleDisplay = (role?: string) =>
  role ? LEADER_ROLES_MAP[role] ?? role : ""

export const getNationalityDisplay = (type?: string) =>
  type ? NATIONALITY_MAP[type] ?? type : ""

export const getPositionDisplay = (position?: { role?: string; athleteCategory?: string; leaderRole?: string }) => {
  if (!position?.role) return null
  if (position.role === "Athlete") {
    return position.athleteCategory === "Male" ? "កីឡាករ" : "កីឡាការិនី"
  }
  return getLeaderRoleDisplay(position.leaderRole)
}
