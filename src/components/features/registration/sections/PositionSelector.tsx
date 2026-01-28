/**
 * PositionSelector
 * Uses the unified SelectableCard component from UI
 */
import { SelectableCard } from "@/src/components/ui/selectTableCard";
import { ReactNode } from "react";

interface PositionSelectorCardProps {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

/**
 * PositionSelectorCard - Wrapper using unified SelectableCard
 * Provides the icon + title + description layout for position selection
 */
export function PositionSelectorCard({
  selected,
  onClick,
  icon,
  title,
  description,
  children,
}: PositionSelectorCardProps) {
  return (
    <SelectableCard
      selected={selected}
      onSelect={onClick}
      icon={icon}
      title={title}
      description={description}
      className="p-6 cursor-pointer"
      as="div"
    >
      {children}
    </SelectableCard>
  );
}

// Re-export for backward compatibility
export { PositionSelectorCard as SelectableCard };
