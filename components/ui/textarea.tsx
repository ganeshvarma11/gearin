import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
