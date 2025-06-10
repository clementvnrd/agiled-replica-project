import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PeriodType = "7d" | "30d" | "3m" | "1y" | "all";

interface PeriodOption {
  value: PeriodType;
  label: string;
}

interface PeriodFilterProps {
  value: PeriodType;
  onChange: (period: PeriodType) => void;
  className?: string;
}

const periodOptions: PeriodOption[] = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "3m", label: "3 mois" },
  { value: "1y", label: "1 an" },
  { value: "all", label: "Tout" },
];

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex gap-1 p-1 bg-muted rounded-lg", className)}>
      {periodOptions.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(option.value)}
          className="px-3 py-1.5 h-auto text-xs"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export { PeriodFilter };
