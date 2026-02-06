"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/src/lib/utils";
import type { ReactNode } from "react";

interface EditableFieldProps {
  id: string;
  label: string;
  value: string | undefined;
  displayValue?: string;
  isEditing: boolean;
  onEdit: () => void;
  children?: ReactNode;
  className?: string;
}

export function EditableField({
  id,
  label,
  value,
  displayValue,
  isEditing,
  onEdit,
  children,
  className,
}: EditableFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {isEditing ? (
        children
      ) : (
        <div
          onClick={onEdit}
          className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <span className="text-slate-700">
            {displayValue || value || "មិនមាន"}
          </span>
        </div>
      )}
    </div>
  );
}

interface EditableInputFieldProps {
  id: string;
  label: string;
  value: string | undefined;
  type?: string;
  placeholder?: string;
  required?: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  className?: string;
}

export function EditableInputField({
  id,
  label,
  value,
  type = "text",
  placeholder,
  required,
  isEditing,
  onEdit,
  onChange,
  onBlur,
  className,
}: EditableInputFieldProps) {
  return (
    <EditableField
      id={id}
      label={label}
      value={value}
      isEditing={isEditing}
      onEdit={onEdit}
      className={className}
    >
      <Input
        id={id}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        autoFocus
      />
    </EditableField>
  );
}

interface EditableSelectFieldProps {
  id: string;
  label: string;
  value: string | undefined;
  displayValue?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  className?: string;
}

export function EditableSelectField({
  id,
  label,
  value,
  displayValue,
  options,
  required,
  isEditing,
  onEdit,
  onChange,
  onBlur,
  className,
}: EditableSelectFieldProps) {
  return (
    <EditableField
      id={id}
      label={label}
      value={value}
      displayValue={displayValue}
      isEditing={isEditing}
      onEdit={onEdit}
      className={className}
    >
      <select
        id={id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white"
        autoFocus
        required={required}
      >
        <option value="">ជ្រើសរើស{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </EditableField>
  );
}
