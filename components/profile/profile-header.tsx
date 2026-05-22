"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCompactValue } from "@/lib/utils";
import type { Profile } from "@/types";

export function ProfileHeader({ profile }: { profile: Profile }) {
  const [expanded, setExpanded] = useState(false);
  const showExpand = (profile.bio?.length ?? 0) > 120;
  const stats = [
    profile.followers_count ? `${profile.followers_count} Followers` : null,
    profile.views_count ? `${profile.views_count} Views` : null,
    profile.established_year ? `Est. ${profile.established_year}` : null
  ].filter(Boolean) as string[];

  const bioText =
    showExpand && !expanded
      ? `${profile.bio?.slice(0, 120).trimEnd()}...`
      : formatCompactValue(profile.bio);

  return (
    <section className="animate-fade-up border-b border-border py-10 sm:py-14">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Avatar
              src={profile.avatar_url}
              alt={profile.full_name}
              size="xl"
              className="size-[88px] sm:size-[104px]"
            />
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-[-0.02em] text-foreground sm:text-5xl">
              {profile.full_name}
            </h1>
            {profile.niche ? <Badge className="mt-4">{profile.niche}</Badge> : null}
            {bioText ? (
              <div className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
                {bioText}{" "}
                {showExpand ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    className="font-medium text-foreground"
                  >
                    {expanded ? "Show less" : "Read more"}
                  </button>
                ) : null}
              </div>
            ) : null}
            {stats.length ? (
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {stats.map((item, index) => (
                  <span key={item} className="flex items-center gap-2">
                    <span>
                      <span className="font-semibold text-foreground">{item.split(" ")[0]}</span>{" "}
                      {item.substring(item.indexOf(" ") + 1)}
                    </span>
                    {index < stats.length - 1 ? <span className="text-[#4b4b4b]">·</span> : null}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {profile.business_email || profile.business_phone || profile.location ? (
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <a href="#business-enquiries">
                <Mail className="size-4" />
                Business Enquiries
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
