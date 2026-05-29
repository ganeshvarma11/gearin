import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
};

const variantClasses = {
  primary:
    "bg-accent text-accent-foreground hover:bg-[rgb(79,70,229)] active:scale-[0.98] shadow-soft",
  secondary:
    "border border-border bg-transparent text-foreground hover:bg-white/5 active:scale-[0.98]",
  ghost: "bg-transparent text-foreground hover:bg-white/5 active:scale-[0.98]",
  danger:
    "border border-red-500/35 bg-red-500/10 text-red-200 hover:bg-red-500/15 active:scale-[0.98]"
};

const sizeClasses = {
  sm: "h-11 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
  icon: "h-11 w-11"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", asChild, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(classes, (children.props as { className?: string }).className)
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
