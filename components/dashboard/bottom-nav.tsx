"use client";

import type { ComponentType } from "react";
import { BarChart3, Briefcase, Link2, Radio, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

type Section = "Overview" | "Latest Links" | "Socials" | "Brands" | "Business" | "My Gear" | "Settings";

const items: Array<{ label: Section; icon: ComponentType<{ className?: string }> }> = [
  { label: "Overview", icon: BarChart3 },
  { label: "Latest Links", icon: Link2 },
  { label: "Socials", icon: Radio },
  { label: "Business", icon: Briefcase },
  { label: "My Gear", icon: Wrench }
];

export function BottomNav({
  active,
  onSelect
}: {
  active: Section;
  onSelect: (value: Section) => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const activeItem = item.label === active;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 text-[11px]",
                activeItem ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("size-4", activeItem ? "text-accent" : "text-muted-foreground")} />
              {item.label.replace("Latest ", "")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
