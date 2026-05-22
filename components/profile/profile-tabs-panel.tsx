"use client";

import { useState } from "react";

import { BusinessTab } from "@/components/profile/business-tab";
import { BrandsTab } from "@/components/profile/brands-tab";
import { GearTab } from "@/components/profile/gear-tab";
import { LatestTab } from "@/components/profile/latest-tab";
import { SocialsTab } from "@/components/profile/socials-tab";
import { TabNav } from "@/components/profile/tab-nav";
import type { Profile } from "@/types";

type ProfileTab = "Latest" | "Socials" | "Brands" | "Business" | "My Gear";

export function ProfileTabsPanel({ profile }: { profile: Profile }) {
  const [tab, setTab] = useState<ProfileTab>("Latest");

  return (
    <>
      <TabNav value={tab} onChange={setTab} />
      <section className="mx-auto max-w-content px-4 py-8 transition-all duration-200 sm:px-6 lg:px-8">
        {tab === "Latest" ? <LatestTab links={profile.latest_links ?? []} /> : null}
        {tab === "Socials" ? <SocialsTab socials={profile.socials ?? []} /> : null}
        {tab === "Brands" ? <BrandsTab brands={profile.brands ?? []} /> : null}
        {tab === "Business" ? <BusinessTab businesses={profile.businesses ?? []} /> : null}
        {tab === "My Gear" ? <GearTab gear={profile.gear ?? []} /> : null}
      </section>
    </>
  );
}
