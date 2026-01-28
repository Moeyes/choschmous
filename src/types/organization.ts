/**
 * Organization Types
 * Types for organizations (provinces, ministries)
 */

/** Organization type values */
export type OrganizationType = 'province' | 'ministry' | string;

/** Organization definition */
export interface Organization {
  id: string;
  type: OrganizationType;
  name: string;
  khmerName?: string;
}