import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select"
import { cn } from '@/src/lib/utils'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface SelectFieldProps {
  value?: string
  onChange: (val: string) => void
  placeholder?: string
  options: Option[]
  className?: string
}

const defaultClassName = "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"

export function SelectField({
  value,
  onChange,
  placeholder = "Select...",
  options,
  className,
}: SelectFieldProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn(defaultClassName, className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
