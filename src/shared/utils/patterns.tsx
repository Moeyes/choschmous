/**
 * Component Patterns
 * Reusable component patterns and compositions
 */

import { type ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'
import { cn } from '@/src/lib/utils'

/**
 * Section wrapper with consistent styling
 */
export function Section({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-6 max-w-md mx-auto', className)}>
      {children}
    </div>
  )
}

/**
 * Card wrapper with consistent styling and optional title
 */
export function StyledCard({
  title,
  children,
  className,
  noPadding = false,
}: {
  title?: string
  children: ReactNode
  className?: string
  noPadding?: boolean
}) {
  if (title) {
    return (
      <Card className={cn('border-none shadow-sm rounded-xl', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('border-none shadow-sm rounded-2xl', !noPadding && 'p-6', className)}>
      {children}
    </Card>
  )
}

/**
 * Grid layout wrapper
 */
export function Grid({
  children,
  cols = 2,
  gap = 4,
  className,
}: {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  gap?: 2 | 4 | 6 | 8
  className?: string
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  const gapClass = `gap-${gap}`

  return (
    <div className={cn('grid', gridCols[cols], gapClass, className)}>
      {children}
    </div>
  )
}

/**
 * InfoRow - Display field with label, value and optional edit action
 */
export function InfoRow({
  label,
  value,
  onEdit,
  className,
}: {
  label: string
  value?: string | null
  onEdit?: () => void
  className?: string
}) {
  return (
    <div className={cn('flex justify-between items-center py-2 border-b border-slate-100 last:border-0', className)}>
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">{value || "—"}</span>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 p-1"
            aria-label={`Edit ${label}`}
          >
            <Edit2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Form field wrapper
 */
export function Field({
  label,
  error,
  children,
  required,
  className,
}: {
  label?: string
  error?: string
  children: ReactNode
  required?: boolean
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/**
 * Action footer with buttons
 */
export function ActionFooter({
  onBack,
  onNext,
  backLabel = 'ត្រលប់',
  nextLabel = 'បន្ត',
  nextDisabled,
  showBack = true,
  className,
}: {
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string
  nextDisabled?: boolean
  showBack?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between gap-4 mt-6', className)}>
      {showBack && onBack ? (
        <Button variant="ghost" onClick={onBack}>
          {backLabel}
        </Button>
      ) : (
        <div />
      )}
      {onNext && (
        <Button onClick={onNext} disabled={nextDisabled} className="rounded-full px-8">
          {nextLabel}
        </Button>
      )}
    </div>
  )
}

/**
 * Icon wrapper with consistent styling
 */
export function IconWrapper({
  children,
  color = 'bg-slate-100',
  size = 'md',
  className,
}: {
  children: ReactNode
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClass = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  }

  return (
    <div className={cn('rounded-xl', color, sizeClass[size], className)}>
      {children}
    </div>
  )
}

/**
 * Loading skeleton
 */
export function LoadingSkeleton({
  className,
  variant = 'rectangular',
}: {
  className?: string
  variant?: 'rectangular' | 'circular' | 'text'
}) {
  const variantClass = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200',
        variantClass[variant],
        className
      )}
    />
  )
}
