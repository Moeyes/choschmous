import * as React from 'react'
import { cn } from '@/src/lib/utils'

interface SelectableCardProps {
  /** Main title text */
  title: React.ReactNode
  /** Optional subtitle text */
  subtitle?: React.ReactNode
  /** Optional description (for more detailed cards) */
  description?: React.ReactNode
  /** Optional icon to display */
  icon?: React.ReactNode
  /** Whether the card is currently selected */
  selected?: boolean
  /** Callback when card is selected */
  onSelect?: () => void
  /** Whether the card is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Render as button or div */
  as?: 'button' | 'div'
  /** Optional children for nested content */
  children?: React.ReactNode
}

/**
 * SelectableCard - Unified selectable card component
 * Used for sport selection, organization selection, position selection, etc.
 */
export function SelectableCard({
  title,
  subtitle,
  description,
  icon,
  selected = false,
  onSelect,
  disabled = false,
  className,
  as = 'button',
  children,
}: SelectableCardProps) {
  const baseStyles = cn(
    'flex flex-col items-start justify-center rounded-2xl border-2 transition-all',
    'hover:border-primary hover:bg-primary/10',
    selected ? 'border-primary bg-primary/10' : 'border-border bg-card',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  )

  const content = (
    <>
      {icon && (
        <div className="flex items-center gap-4 w-full">
          <div className="shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{title}</div>
            {description && (
              <div className="text-sm text-muted-foreground">{description}</div>
            )}
          </div>
        </div>
      )}
      {!icon && (
        <>
          <div className="font-semibold">{title}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
          )}
        </>
      )}
      {children && (
        <div className="w-full mt-4" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </>
  )

  if (as === 'button') {
    return (
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        className={baseStyles}
        aria-pressed={selected}
      >
        {content}
      </button>
    )
  }

  return (
    <div 
      role="button" 
      onClick={disabled ? undefined : onSelect} 
      className={baseStyles}
      aria-pressed={selected}
      tabIndex={disabled ? -1 : 0}
    >
      {content}
    </div>
  )
}
