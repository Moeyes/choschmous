import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerSlot?: ReactNode;
}

export function SectionCard({
  title,
  subtitle,
  children,
  className,
  headerSlot,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border border-slate-200 bg-white/60 p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      {(title || subtitle || headerSlot) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title && (
              <p className="text-sm font-semibold text-slate-800">{title}</p>
            )}
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
          {headerSlot}
        </div>
      )}
      {children}
    </div>
  );
}
