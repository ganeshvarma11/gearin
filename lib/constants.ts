import type { Niche } from "@/types";

export const niches: Niche[] = [
  "Podcaster",
  "YouTuber",
  "Fitness",
  "Tech",
  "Fashion",
  "Food",
  "Travel",
  "Education",
  "Gaming",
  "Finance",
  "Other"
];

export const gearCategories = [
  "All",
  "Camera",
  "Audio",
  "Software",
  "Books",
  "Other"
] as const;

export const dashboardSections = [
  "Overview",
  "Latest Links",
  "Socials",
  "Brands",
  "Business",
  "My Gear",
  "Settings"
] as const;
