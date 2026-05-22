import * as React from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-12 w-full appearance-none rounded-lg border border-input bg-card px-4 pr-11 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    );
  }
);

Select.displayName = "Select";
