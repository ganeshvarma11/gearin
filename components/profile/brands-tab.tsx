import { ArrowUpRight } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Brand } from "@/types";

export function BrandsTab({ brands }: { brands: Brand[] }) {
  if (!brands.length) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        Brand collaborations will appear here when they go live.
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-border">
      {brands.map((brand) => (
        <div key={brand.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar src={brand.logo_url} alt={brand.name} size="sm" />
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">{brand.name}</h3>
              {brand.description ? (
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{brand.description}</p>
              ) : null}
            </div>
          </div>
          {brand.website_url ? (
            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
                Visit
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          ) : null}
        </div>
      ))}
    </Card>
  );
}
