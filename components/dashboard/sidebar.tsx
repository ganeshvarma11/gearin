"use client";

import type { ComponentType } from "react";
import { BarChart3, Briefcase, Cog, Layers3, Link2, Radio, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

type Section = "Overview" | "Latest Links" | "Socials" | "Brands" | "Business" | "My Gear" | "Settings";

const items: Array<{ label: Section; icon: ComponentType<{ className?: string }> }> = [
  { label: "Overview", icon: BarChart3 },
  { label: "Latest Links", icon: Link2 },
  { label: "Socials", icon: Radio },
  { label: "Brands", icon: Layers3 },
  { label: "Business", icon: Briefcase },
  { label: "My Gear", icon: Wrench },
  { label: "Settings", icon: Cog }
];

export function Sidebar({
  active,
  onSelect
}: {
  active: Section;
  onSelect: (value: Section) => void;
}) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border lg:block">
      <div className="sticky top-0 p-6">
        <div className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">Gearin</div>
        <nav className="mt-8 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const activeItem = item.label === active;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelect(item.label)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
                  activeItem ? "bg-white/5 text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("size-4", activeItem ? "text-accent" : "text-muted-foreground")} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
