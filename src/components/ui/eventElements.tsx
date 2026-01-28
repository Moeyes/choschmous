/**
 * Shared Event Components
 * Reusable components for event display across the app
 */

import * as React from 'react';
import { Calendar } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import { formatDateToKhmerLabeled, toKhmerDigits } from '@/src/lib/khmer';
import type { SportRecord } from '@/src/types/sport';

/**
 * SportBadges - Displays sport badges consistently
 * Used in EventCard, RecommendationCard, etc.
 */
interface SportBadgesProps {
  sports: (string | SportRecord)[];
  className?: string;
}

export function SportBadges({ sports, className }: SportBadgesProps) {
  if (!sports || sports.length === 0) return null;
  
  return (
    <div className={className ?? 'flex flex-wrap gap-2 pt-2'}>
      {sports.map((sport) => {
        const sportName = typeof sport === 'string' ? sport : sport?.name ?? String(sport);
        const key = typeof sport === 'string' ? sport : sport?.id ?? sportName;
        return (
          <Badge
            key={key}
            variant="secondary"
            className="rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 border-none text-[10px] font-bold px-3"
          >
            {sportName}
          </Badge>
        );
      })}
    </div>
  );
}

/**
 * EventDateRange - Displays event date range consistently
 */
interface EventDateRangeProps {
  startDate?: string;
  endDate?: string;
  showIcon?: boolean;
  className?: string;
}

export function EventDateRange({ 
  startDate, 
  endDate, 
  showIcon = true,
  className 
}: EventDateRangeProps) {
  if (!startDate) return null;
  
  return (
    <div className={className ?? 'flex items-center gap-2 text-muted-foreground'}>
      {showIcon && <Calendar className="h-5 w-5" />}
      <span className="text-sm">
        {formatDateToKhmerLabeled(startDate) || startDate}{endDate ? ` - ${formatDateToKhmerLabeled(endDate) || endDate}` : ''}
      </span>
    </div>
  );
}

/**
 * ScoreBadge - Displays recommendation score
 */
interface ScoreBadgeProps {
  score: number;
  showPercentage?: boolean;
}

export function ScoreBadge({ score, showPercentage = true }: ScoreBadgeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 0.8) return 'bg-green-500 text-white';
    if (s >= 0.6) return 'bg-blue-500 text-white';
    if (s >= 0.4) return 'bg-yellow-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 0.8) return 'Excellent';
    if (s >= 0.6) return 'Good';
    if (s >= 0.4) return 'Fair';
    return 'Low';
  };

  return (
    <Badge className={`${getScoreColor(score)} text-xs`}>
      {getScoreLabel(score)}
      {showPercentage && ` (${toKhmerDigits(Math.round(score * 100))}%)`}
    </Badge>
  );
}
