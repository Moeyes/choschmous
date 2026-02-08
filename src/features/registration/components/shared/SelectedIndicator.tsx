import { Check } from "lucide-react";

interface SelectedIndicatorProps {
  label: string;
  value: string;
}

export function SelectedIndicator({ label, value }: SelectedIndicatorProps) {
  return (
    <div className="secondary-indicator">
      <Check className="h-4 w-4 text-emerald-600" />
      <span>
        {label}: <span className="secondary-indicator-name">{value}</span>
      </span>
    </div>
  );
}
