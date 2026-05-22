import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
