import type { Profile } from "@/types";

export const demoProfiles: Profile[] = [
  {
    id: "1",
    username: "rajshamani",
    full_name: "Raj Shamani",
    bio: "Podcaster, founder, and storyteller building one of India's sharpest creator-business ecosystems.",
    niche: "Leading Indian Podcaster",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    followers_count: "47M+",
    views_count: "3.4B",
    established_year: "2019",
    business_email: "brand@rajshamani.com",
    business_phone: "+91 98765 43210",
    location: "Mumbai, India",
    is_verified: true,
    latest_links: [
      {
        id: "l1",
        title: "The Raj Shamani Podcast",
        url: "https://youtube.com",
        description: "Deep conversations with operators, artists, and founders shaping modern India.",
        thumbnail_url:
          "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=300&q=80",
        sort_order: 0
      },
      {
        id: "l2",
        title: "House of X Newsletter",
        url: "https://substack.com",
        description: "Weekly insights on business, creator leverage, and high-agency living.",
        thumbnail_url:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80",
        sort_order: 1
      },
      {
        id: "l3",
        title: "Creator Growth Playbook",
        url: "https://gumroad.com",
        description: "Frameworks Raj uses to grow distribution, trust, and monetization.",
        thumbnail_url:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=300&q=80",
        sort_order: 2
      }
    ],
    socials: [
      {
        id: "s1",
        platform: "Instagram",
        handle: "@rajshamani",
        followers_count: "4.2M",
        url: "https://instagram.com",
        sort_order: 0
      },
      {
        id: "s2",
        platform: "YouTube",
        handle: "@rajshamani",
        followers_count: "3.1M",
        url: "https://youtube.com",
        sort_order: 1
      },
      {
        id: "s3",
        platform: "X",
        handle: "@rajshamani",
        followers_count: "1.8M",
        url: "https://x.com",
        sort_order: 2
      },
      {
        id: "s4",
        platform: "LinkedIn",
        handle: "/in/rajshamani",
        followers_count: "620K",
        url: "https://linkedin.com",
        sort_order: 3
      }
    ],
    brands: [
      {
        id: "b1",
        name: "CoinSwitch",
        description: "Financial literacy campaigns and high-trust brand storytelling.",
        website_url: "https://coinswitch.co",
        sort_order: 0
      },
      {
        id: "b2",
        name: "Samsung",
        description: "Creator-led launches focused on productivity and mobile filmmaking.",
        website_url: "https://samsung.com",
        sort_order: 1
      }
    ],
    businesses: [
      {
        id: "bu1",
        name: "House of X",
        description: "A modern media and consumer brand building products around ambitious young India.",
        website_url: "https://houseofx.in",
        sort_order: 0
      },
      {
        id: "bu2",
        name: "Figuring Out Media",
        description: "Thought pieces, frameworks, and experiments in creator-first business design.",
        website_url: "https://figuringoutmedia.com",
        sort_order: 1
      }
    ],
    gear: [
      {
        id: "g1",
        name: "Sony A7 IV",
        category: "Camera",
        creator_note: "My main interview camera. Reliable skin tones, easy workflow, strong low light.",
        buy_url: "https://sony.com",
        sort_order: 0
      },
      {
        id: "g2",
        name: "Shure SM7B",
        category: "Audio",
        creator_note: "The podcast staple. Warm tone and forgiving enough for long-form conversations.",
        buy_url: "https://shure.com",
        sort_order: 1
      },
      {
        id: "g3",
        name: "Notion",
        category: "Software",
        creator_note: "Where my team tracks guests, show notes, research, and brand ops.",
        buy_url: "https://notion.so",
        sort_order: 2
      }
    ]
  },
  {
    id: "2",
    username: "kritikagoel",
    full_name: "Kritika Goel",
    bio: "Travel creator documenting design-forward stays, refined itineraries, and stories worth saving.",
    niche: "Travel Creator",
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    followers_count: "3.8M+",
    views_count: "620M",
    established_year: "2018",
    latest_links: [
      {
        id: "l4",
        title: "Japan Spring Guide",
        url: "https://example.com/japan",
        description: "My full Kyoto + Tokyo route, from cafes to ryokans to hidden neighborhoods.",
        thumbnail_url:
          "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=300&q=80",
        sort_order: 0
      }
    ],
    socials: [
      {
        id: "s5",
        platform: "Instagram",
        handle: "@kritikagoel",
        followers_count: "1.9M",
        url: "https://instagram.com",
        sort_order: 0
      },
      {
        id: "s6",
        platform: "YouTube",
        handle: "@kritikagoel",
        followers_count: "840K",
        url: "https://youtube.com",
        sort_order: 1
      }
    ],
    brands: [],
    businesses: [],
    gear: []
  },
  {
    id: "3",
    username: "arjuncodes",
    full_name: "Arjun Mehta",
    bio: "Tech educator helping builders ship smarter with AI, systems, and product thinking.",
    niche: "Tech Educator",
    avatar_url:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    followers_count: "1.2M+",
    views_count: "145M",
    established_year: "2020",
    latest_links: [],
    socials: [],
    brands: [],
    businesses: [],
    gear: []
  },
  {
    id: "4",
    username: "fitwithnaina",
    full_name: "Naina Verma",
    bio: "Performance coach blending strength, mobility, and long-term health for busy founders.",
    niche: "Fitness Coach",
    avatar_url:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
    followers_count: "890K+",
    views_count: "98M",
    established_year: "2021",
    latest_links: [],
    socials: [],
    brands: [],
    businesses: [],
    gear: []
  },
  {
    id: "5",
    username: "chefaditya",
    full_name: "Aditya Rao",
    bio: "Food creator turning regional Indian recipes into cinematic stories and practical kitchen rituals.",
    niche: "Food Creator",
    avatar_url:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=600&q=80",
    followers_count: "2.4M+",
    views_count: "410M",
    established_year: "2017",
    latest_links: [],
    socials: [],
    brands: [],
    businesses: [],
    gear: []
  },
  {
    id: "6",
    username: "financewithriya",
    full_name: "Riya Kapoor",
    bio: "Finance creator making wealth building feel clear, practical, and less intimidating.",
    niche: "Finance Creator",
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
    followers_count: "1.7M+",
    views_count: "280M",
    established_year: "2019",
    latest_links: [],
    socials: [],
    brands: [],
    businesses: [],
    gear: []
  }
];
