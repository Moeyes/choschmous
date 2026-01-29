"use client"

import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { iconSizes, buttonSizes } from '@/src/shared/utils/componentUtils'

interface ActionButtonsProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
  size?: "sm" | "default"
  className?: string
}

const actions = [
  { key: 'view', icon: Eye, label: 'មើល', color: 'text-slate-500 hover:text-slate-700' },
  { key: 'edit', icon: Pencil, label: 'កែប្រែ', color: 'text-slate-500 hover:text-slate-700' },
  { key: 'delete', icon: Trash2, label: 'លុប', color: 'text-slate-400 hover:text-red-500 hover:bg-red-50' },
] as const

export function ActionButtons({ 
  onView, 
  onEdit, 
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
  size = "sm",
  className 
}: ActionButtonsProps) {
  const callbacks = { view: onView, edit: onEdit, delete: onDelete }
  const visibility = { view: showView, edit: showEdit, delete: showDelete }
  const iconSize = size === "sm" ? iconSizes.sm : iconSizes.md

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {actions.map(({ key, icon: Icon, color }) => {
        const onClick = callbacks[key]
        const show = visibility[key]
        
        if (!show || !onClick) return null

        return (
          <Button
            key={key}
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={cn('h-8 w-8 hover:bg-slate-50', color)}
          >
            <Icon className={iconSize} />
          </Button>
        )
      })}
    </div>
  )
}

export default ActionButtons
