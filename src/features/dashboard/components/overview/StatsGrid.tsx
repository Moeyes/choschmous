"use client"

import { StyledCard, Grid } from "@/src/shared/utils/patterns"
import type { ReactNode } from "react"

type StatItem = {
  label: string
  value: string | number
  color?: string
  icon?: ReactNode
}

export default function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <Grid cols={4}>
      {items.map((s) => (
        <StyledCard key={s.label} noPadding>
          <div className="p-6 flex items-center gap-4">
            <div className={`${s.color ?? "bg-slate-100"} p-3 rounded-xl`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        </StyledCard>
      ))}
    </Grid>
  )
}
