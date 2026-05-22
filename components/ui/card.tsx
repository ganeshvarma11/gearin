import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "surface-gradient rounded-xl border border-border transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
