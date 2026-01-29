"use client"

import { cn } from "@/src/lib/utils"

interface FilterOption {
  value: string
  label: string
}

interface FilterDropdownProps {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  placeholder?: string
  className?: string
}

export function FilterDropdown({ 
  value, 
  onChange, 
  options,
  placeholder = "ជ្រើសរើស...",
  className 
}: FilterDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
        "cursor-pointer appearance-none",
        className
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default FilterDropdown
