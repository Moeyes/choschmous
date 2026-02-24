// Represents the participants count by gender
export interface Participants {
  male: number;
  female: number;
}

// Represents a single sport within an organization/pro registration
export interface SportEntry {
  sport_id: string;
  participants: Participants;
}

// Represents a survey response for an organization/pro
export interface Survey {
  organization_id: string;
  sports: SportEntry[]; // multiple sports per org/pro
}
