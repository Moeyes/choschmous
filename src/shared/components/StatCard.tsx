"use client"

import { StyledCard, IconWrapper } from '@/src/shared/utils/patterns'
import { cn } from "@/src/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  color?: string
  icon?: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  className?: string
}

export function StatCard({ 
  label, 
  value, 
  color = "bg-slate-100", 
  icon,
  trend,
  className 
}: StatCardProps) {
  return (
    <StyledCard className={className}>
      <div className="flex items-center gap-4">
        {icon && <IconWrapper color={color}>{icon}</IconWrapper>}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium uppercase">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </StyledCard>
  )
}

export default StatCard
