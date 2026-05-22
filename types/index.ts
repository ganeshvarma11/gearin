export type Niche =
  | "Podcaster"
  | "YouTuber"
  | "Fitness"
  | "Tech"
  | "Fashion"
  | "Food"
  | "Travel"
  | "Education"
  | "Gaming"
  | "Finance"
  | "Other";

export type LatestLink = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  thumbnail_url?: string | null;
  is_visible?: boolean;
  sort_order?: number;
};

export type Social = {
  id: string;
  platform: string;
  handle: string;
  url?: string | null;
  followers_count?: string | null;
  sort_order?: number;
};

export type Brand = {
  id: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  sort_order?: number;
};

export type Business = {
  id: string;
  name: string;
  description?: string | null;
  website_url?: string | null;
  sort_order?: number;
};

export type GearItem = {
  id: string;
  name: string;
  category?: string | null;
  creator_note?: string | null;
  buy_url?: string | null;
  sort_order?: number;
};

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  bio?: string | null;
  niche?: string | null;
  avatar_url?: string | null;
  followers_count?: string | null;
  views_count?: string | null;
  established_year?: string | null;
  business_email?: string | null;
  business_phone?: string | null;
  location?: string | null;
  is_verified?: boolean;
  latest_links?: LatestLink[];
  socials?: Social[];
  brands?: Brand[];
  businesses?: Business[];
  gear?: GearItem[];
};
