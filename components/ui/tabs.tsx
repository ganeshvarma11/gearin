"use client";

import { cn } from "@/lib/utils";

type TabsProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  tabs: readonly T[];
  className?: string;
};

export function Tabs<T extends string>({
  value,
  onValueChange,
  tabs,
  className
}: TabsProps<T>) {
  return (
    <div className={cn("no-scrollbar flex gap-6 overflow-x-auto border-b border-border", className)}>
      {tabs.map((tab) => {
        const active = tab === value;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onValueChange(tab)}
            className={cn(
              "relative shrink-0 whitespace-nowrap border-b-2 pb-4 text-sm font-medium transition-colors",
              active ? "border-accent text-foreground" : "border-transparent text-[#666666] hover:text-foreground"
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
