/**
 * Athlete Types
 * Extended participant types for athletes
 */

import type { Participation, ParticipationGender } from './participation';

/** Medal count for an athlete */
export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
}

/** Athlete extends base Participation with additional fields */
export interface Athlete extends Participation {
  status: string;
  gender: ParticipationGender;
  sportCategory: string;
  medals?: MedalCount;
}