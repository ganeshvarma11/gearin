"use client";

import { useState } from "react";

import { gearCategories } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GearItem } from "@/types";

export function GearTab({ gear }: { gear: GearItem[] }) {
  const [category, setCategory] = useState<(typeof gearCategories)[number]>("All");
  const filtered = gear.filter((item) => category === "All" || item.category === category);

  return (
    <div>
      <div className="no-scrollbar mb-6 flex gap-3 overflow-x-auto">
        {gearCategories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
              item === category
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col gap-4 p-5 hover:-translate-y-0.5 hover:border-[#333333] hover:shadow-glow sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[15px] font-semibold text-foreground">{item.name}</h3>
                  {item.category ? (
                    <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                      {item.category}
                    </span>
                  ) : null}
                </div>
                {item.creator_note ? (
                  <p className="mt-2 text-sm italic leading-6 text-muted-foreground">
                    {item.creator_note}
                  </p>
                ) : null}
              </div>
              {item.buy_url ? (
                <Button asChild variant="secondary" className="w-full sm:w-auto">
                  <a href={item.buy_url} target="_blank" rel="noopener noreferrer">
                    Buy / View
                  </a>
                </Button>
              ) : null}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Nothing has been added in this category yet.
        </Card>
      )}
    </div>
  );
}
