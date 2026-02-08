import { Check } from "lucide-react";

interface SelectionPillProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  variant?: "indigo" | "purple" | "emerald";
  size?: "default" | "sm";
}

export function SelectionPill({
  label,
  isSelected,
  onClick,
  variant = "indigo",
  size = "default",
}: SelectionPillProps) {
  const sizeClass = size === "sm" ? "text-sm" : "";

  return (
    <button
      onClick={onClick}
      className={`selection-pill ${variant} ${sizeClass} ${isSelected ? "selected" : ""}`}
    >
      <span className="flex items-center gap-2">
        {label}
        {isSelected && <Check className="h-4 w-4" />}
      </span>
    </button>
  );
}
