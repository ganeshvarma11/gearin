import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { LatestLink } from "@/types";

export function LatestTab({ links }: { links: LatestLink[] }) {
  if (!links.length) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        No live drops yet. The next release, video, or launch will show up here first.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="flex items-center gap-4 p-4 hover:-translate-y-0.5 hover:border-[#333333] hover:shadow-glow">
            {link.thumbnail_url ? (
              <div className="relative size-[60px] overflow-hidden rounded-lg border border-border">
                <Image
                  src={link.thumbnail_url}
                  alt={link.title}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground sm:text-[15px]">
                {link.title}
              </div>
              {link.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {link.description}
                </p>
              ) : null}
            </div>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
          </Card>
        </a>
      ))}
    </div>
  );
}
