// features/sports/types.ts

/* ================================
   Base Sport (DB shape)
================================ */

export type SportStatus = "upcoming" | "ongoing" | "completed";

export interface DashboardSport {
  id: string;
  name: string;
  category: string;
  status: SportStatus;
  participants?: number;
}

/* ================================
   Participant
================================ */
export interface DashboardParticipant {
  id: string;
  name: string;
  sport?: string; // sport name reference
  sportId?: string; // sport id reference
  position?: {
    role: "Athlete" | "Leader" | "Coach";
  };
}

/* ================================
   Enhanced Sport (Computed)
   Used in UI only
================================ */
export interface EnhancedSport extends DashboardSport {
  totalParticipants: number;
  athletes: number;
  leaders: number;
  coaches: number;
}

/* ================================
   Create / Update DTO
================================ */
export interface CreateSportDTO {
  name: string;
  category?: string;
  status?: "upcoming" | "ongoing" | "completed";
}

export interface UpdateSportDTO extends DashboardSport {}
