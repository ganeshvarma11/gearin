import { cache } from "react";

import { demoProfiles } from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Profile } from "@/types";

function sortByOrder<T extends { sort_order?: number | null }>(items: T[] = []) {
  return [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function normalizeProfile(profile: Profile): Profile {
  return {
    ...profile,
    latest_links: sortByOrder(profile.latest_links),
    socials: sortByOrder(profile.socials),
    brands: sortByOrder(profile.brands),
    businesses: sortByOrder(profile.businesses),
    gear: sortByOrder(profile.gear)
  };
}

export const getFeaturedCreators = cache(async () => {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return demoProfiles.slice(0, 6).map(normalizeProfile);
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (!data?.length) {
    return demoProfiles.slice(0, 6).map(normalizeProfile);
  }

  return data as Profile[];
});

export const searchCreators = cache(async (query: string) => {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return demoProfiles
      .filter((profile) => {
        return (
          profile.full_name.toLowerCase().includes(term) ||
          profile.username.toLowerCase().includes(term) ||
          profile.niche?.toLowerCase().includes(term)
        );
      })
      .slice(0, 5)
      .map(normalizeProfile);
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .or(`username.ilike.%${term}%,full_name.ilike.%${term}%,niche.ilike.%${term}%`)
    .limit(5);

  return (data as Profile[] | null) ?? [];
});

export const getProfileByUsername = cache(async (username: string) => {
  const normalized = username.toLowerCase();
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    const profile = demoProfiles.find((item) => item.username === normalized);
    return profile ? normalizeProfile(profile) : null;
  }

  const { data } = await supabase
    .from("profiles")
    .select(
      `
      *,
      latest_links (*),
      socials (*),
      brands (*),
      businesses (*),
      gear (*)
    `
    )
    .eq("username", normalized)
    .single();

  return data ? normalizeProfile(data as Profile) : null;
});

export const isUsernameAvailable = cache(async (username: string) => {
  const normalized = username.toLowerCase();
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return !demoProfiles.some((profile) => profile.username === normalized);
  }

  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", normalized)
    .maybeSingle();

  return !data;
});

export const getDashboardProfile = cache(async () => {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return normalizeProfile(demoProfiles[0]);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return normalizeProfile(demoProfiles[0]);
  }

  const { data } = await supabase
    .from("profiles")
    .select(
      `
      *,
      latest_links (*),
      socials (*),
      brands (*),
      businesses (*),
      gear (*)
    `
    )
    .eq("id", user.id)
    .single();

  if (data) {
    return normalizeProfile(data as Profile);
  }

  return {
    id: user.id,
    username: user.user_metadata.username ?? "creator",
    full_name: user.user_metadata.full_name ?? "Creator",
    niche: user.user_metadata.niche ?? "Other",
    bio: "",
    avatar_url: user.user_metadata.avatar_url ?? "",
    followers_count: "",
    views_count: "",
    established_year: "",
    business_email: user.email ?? "",
    business_phone: "",
    location: "",
    latest_links: [],
    socials: [],
    brands: [],
    businesses: [],
    gear: []
  };
});
