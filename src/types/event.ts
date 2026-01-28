/**
 * Event Types
 * Types for sports events
 */

import type { SportRecord } from './sport';

/** Event status values */
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | string;

/** Event definition */
export interface Event {
  id: string;
  name: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  sports: (string | SportRecord)[];
  status?: EventStatus;
  location?: string;
  image?: string;
}
