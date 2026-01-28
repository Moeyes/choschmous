/**
 * Medal Types
 * Types for medal awards
 */

/** Medal type values */
export type MedalType = 'gold' | 'silver' | 'bronze';

/** Medal award record */
export interface Medal {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteNameKh?: string;
  sportId: string;
  sportName: string;
  medalType: MedalType;
  province?: string;
  awardedDate?: string;
  event: string;
}
