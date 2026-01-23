import type { Participation } from './participation'

export interface Athlete extends Participation {
  status: string;
  position: Participation['position'];

  gender: 'Male' | 'Female';

  sportCategory: string;



  medals?: {
    gold: number;
    silver: number;
    bronze: number;
  };
}