import * as React from 'react'
import { cn } from '@/lib/utils'

interface SelectableCardProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  selected?: boolean
  onSelect?: () => void
  disabled?: boolean
  className?: string
  as?: 'button' | 'div'
}

export function SelectableCard({
  title,
  subtitle,
  selected = false,
  onSelect,
  disabled = false,
  className,
  as = 'button',
}: SelectableCardProps) {
  const Tag: any = as === 'div' ? 'div' : 'button'

  const commonProps: any = {
    className: cn(
      'flex flex-col items-start justify-center rounded-2xl border-2 transition-all hover:border-primary hover:bg-primary/10',
      selected ? 'border-primary bg-primary/10' : 'border-border bg-card',
      disabled && 'opacity-50 cursor-not-allowed',
      className,
    ),
    'aria-pressed': selected,
  }

  if (as === 'button') {
    return (
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        {...commonProps}
      >
        <div className="font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </button>
    )
  }

  return (
    <div role="button" onClick={onSelect} {...commonProps}>
      <div className="font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  )
}
