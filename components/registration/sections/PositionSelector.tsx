import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export function SelectableCard({
  selected,
  onClick,
  icon,
  title,
  description,
  children,
}: SelectableCardProps) {
  return (
    <Card
      className={`cursor-pointer border-2 ${selected ? "border-primary" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <p className="font-bold">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {children && (
          <div onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
