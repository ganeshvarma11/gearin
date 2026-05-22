import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Profile } from "@/types";

export function CreatorCard({ creator }: { creator: Profile }) {
  return (
    <Card className="group flex h-full flex-col justify-between p-6 hover:-translate-y-0.5 hover:border-[#333333] hover:shadow-glow">
      <div>
        <div className="flex items-start justify-between gap-4">
          <Avatar src={creator.avatar_url} alt={creator.full_name} />
          {creator.niche ? <Badge>{creator.niche}</Badge> : null}
        </div>
        <h3 className="mt-5 font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
          {creator.full_name}
        </h3>
        <p className="mt-2 font-mono text-sm text-muted-foreground">@{creator.username}</p>
        <div className="mt-4 text-sm text-foreground">{creator.followers_count} followers</div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {creator.bio}
        </p>
      </div>
      <Button asChild className="mt-8 w-full">
        <Link href={`/${creator.username}`}>View Profile</Link>
      </Button>
    </Card>
  );
}
