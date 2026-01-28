import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";

interface Option {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface SelectFieldProps {
  value?: string | undefined;
  onChange: (val: string) => void;
  placeholder?: string;
  options: Option[];
  className?: string;
}

export function SelectField({
  value,
  onChange,
  placeholder = "Select...",
  options,
  className,
}: SelectFieldProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val)}>
        <SelectTrigger
        className={
          className ??
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        }
      >
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
  );
}
