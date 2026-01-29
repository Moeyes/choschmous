"use client"

import { cn } from "@/src/lib/utils"
import { FileX, Users, Trophy, MapPin } from "lucide-react"

type EmptyStateType = "participants" | "sports" | "events" | "provinces" | "default"

interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

const EMPTY_CONFIG: Record<EmptyStateType, { icon: React.ElementType; title: string; description: string }> = {
  participants: {
    icon: Users,
    title: "មិនមានអ្នកចូលរួម",
    description: "មិនទាន់មានអ្នកចូលរួមណាត្រូវបានចុះឈ្មោះនៅឡើយទេ",
  },
  sports: {
    icon: Trophy,
    title: "មិនមានកីឡា",
    description: "មិនទាន់មានកីឡាណាត្រូវបានបន្ថែមនៅឡើយទេ",
  },
  events: {
    icon: FileX,
    title: "មិនមានព្រឹត្តិការណ៍",
    description: "មិនទាន់មានព្រឹត្តិការណ៍ណាត្រូវបានបង្កើតនៅឡើយទេ",
  },
  provinces: {
    icon: MapPin,
    title: "មិនមានខេត្ត/ក្រុង",
    description: "មិនទាន់មានខេត្ត/ក្រុងណាត្រូវបានចុះឈ្មោះនៅឡើយទេ",
  },
  default: {
    icon: FileX,
    title: "មិនមានទិន្នន័យ",
    description: "មិនមានទិន្នន័យដែលត្រូវបង្ហាញ",
  },
}

export function EmptyState({ 
  type = "default", 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  const config = EMPTY_CONFIG[type]
  const Icon = config.icon

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-4 text-center",
      className
    )}>
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm">
        {description || config.description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState
