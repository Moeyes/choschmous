"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface ParticipantAvatarProps {
  photoUrl?: string | null
  name?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZE_CLASSES = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

const ICON_SIZES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

export function ParticipantAvatar({ 
  photoUrl, 
  name = "", 
  size = "md",
  className 
}: ParticipantAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar className={cn(SIZE_CLASSES[size], "ring-2 ring-slate-100", className)}>
      <AvatarImage src={photoUrl || undefined} alt={name} />
      <AvatarFallback className="bg-slate-100 text-slate-600">
        {initials || <User className={ICON_SIZES[size]} />}
      </AvatarFallback>
    </Avatar>
  )
}

export default ParticipantAvatar
