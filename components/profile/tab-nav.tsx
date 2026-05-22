"use client";

import { cn } from "@/lib/utils";

type ProfileTab = "Latest" | "Socials" | "Brands" | "Business" | "My Gear";

export function TabNav({
  value,
  onChange
}: {
  value: ProfileTab;
  onChange: (value: ProfileTab) => void;
}) {
  const tabs: ProfileTab[] = ["Latest", "Socials", "Brands", "Business", "My Gear"];

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const active = tab === value;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onChange(tab)}
                className={cn(
                  "relative shrink-0 border-b-2 py-4 text-sm font-medium transition-colors",
                  active ? "border-accent text-foreground" : "border-transparent text-[#666666] hover:text-foreground"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
