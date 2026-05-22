import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatUrl } from "@/lib/utils";
import type { Business } from "@/types";

export function BusinessTab({ businesses }: { businesses: Business[] }) {
  if (!businesses.length) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        No ventures have been added yet. This is where the creator&apos;s companies and projects will live.
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {businesses.map((business) => (
        <Card
          key={business.id}
          className="flex h-full flex-col justify-between p-6 hover:-translate-y-0.5 hover:border-[#333333] hover:shadow-glow"
        >
          <div>
            <h3 className="text-xl font-semibold text-foreground">{business.name}</h3>
            {business.description ? (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{business.description}</p>
            ) : null}
            {business.website_url ? (
              <p className="mt-5 font-mono text-xs text-accent">{formatUrl(business.website_url)}</p>
            ) : null}
          </div>
          {business.website_url ? (
            <Button asChild className="mt-8 w-full sm:w-auto">
              <a href={business.website_url} target="_blank" rel="noopener noreferrer">
                Visit
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
