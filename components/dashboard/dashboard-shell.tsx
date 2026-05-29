"use client";

import type { ChangeEvent, DragEvent, ReactNode } from "react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  ExternalLink,
  GripVertical,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Save,
  Trash2,
  TriangleAlert,
  Upload
} from "lucide-react";

import { BottomNav } from "@/components/dashboard/bottom-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { niches } from "@/lib/constants";
import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase-browser";
import { formatUrl, isUuid, isValidUsername, sanitizeUsername } from "@/lib/utils";
import type { Brand, Business, GearItem, LatestLink, Profile, Social } from "@/types";

type Section = "Overview" | "Latest Links" | "Socials" | "Brands" | "Business" | "My Gear" | "Settings";
type CollectionKey = "latest_links" | "socials" | "brands" | "businesses" | "gear";
type EditableItem = LatestLink | Social | Brand | Business | GearItem;
type FormValue = Record<string, string>;
type AvailabilityState = "idle" | "checking" | "available" | "taken" | "invalid";

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "url" | "textarea";
  required?: boolean;
  placeholder?: string;
};

type CollectionConfig = {
  section: Exclude<Section, "Overview" | "Settings">;
  key: CollectionKey;
  title: string;
  description: string;
  addLabel: string;
  fields: FieldConfig[];
  emptyMessage: string;
  renderPreview: (item: EditableItem) => ReactNode;
};

const collectionConfigs: CollectionConfig[] = [
  {
    section: "Latest Links",
    key: "latest_links",
    title: "Latest Links",
    description: "Feature the things you want followers to see first.",
    addLabel: "Add link",
    emptyMessage: "Add the first live drop, launch, video, or collab.",
    fields: [
      { name: "title", label: "Title", required: true, placeholder: "Creator Growth Playbook" },
      { name: "url", label: "URL", type: "url", required: true, placeholder: "https://example.com" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Why this link matters right now." },
      { name: "thumbnail_url", label: "Thumbnail URL", type: "url", placeholder: "https://images..." }
    ],
    renderPreview: (item) => {
      const link = item as LatestLink;
      return (
        <div>
          <div className="font-medium text-foreground">{link.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{link.description || formatUrl(link.url)}</div>
        </div>
      );
    }
  },
  {
    section: "Socials",
    key: "socials",
    title: "Socials",
    description: "Keep every audience channel current and easy to follow.",
    addLabel: "Add social",
    emptyMessage: "Connect your first platform so fans know where to follow you.",
    fields: [
      { name: "platform", label: "Platform", required: true, placeholder: "Instagram" },
      { name: "handle", label: "Handle", required: true, placeholder: "@yourhandle" },
      { name: "url", label: "Profile URL", type: "url", placeholder: "https://instagram.com/yourhandle" },
      { name: "followers_count", label: "Followers", placeholder: "1.2M" }
    ],
    renderPreview: (item) => {
      const social = item as Social;
      return (
        <div>
          <div className="font-medium text-foreground">
            {social.platform} <span className="text-muted-foreground">{social.handle}</span>
          </div>
          <div className="mt-1 font-mono text-sm text-accent">{social.followers_count || "No count added"}</div>
        </div>
      );
    }
  },
  {
    section: "Brands",
    key: "brands",
    title: "Brands",
    description: "Show partnerships and sponsorships with clean, credible context.",
    addLabel: "Add brand",
    emptyMessage: "Add the first brand partner or sponsor.",
    fields: [
      { name: "name", label: "Brand Name", required: true, placeholder: "Samsung" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Campaign, ambassador role, or collab context." },
      { name: "logo_url", label: "Logo URL", type: "url", placeholder: "https://images..." },
      { name: "website_url", label: "Website URL", type: "url", placeholder: "https://brand.com" }
    ],
    renderPreview: (item) => {
      const brand = item as Brand;
      return (
        <div>
          <div className="font-medium text-foreground">{brand.name}</div>
          <div className="mt-1 text-sm text-muted-foreground">{brand.description || "No description added"}</div>
        </div>
      );
    }
  },
  {
    section: "Business",
    key: "businesses",
    title: "Business",
    description: "List the ventures, companies, and ecosystems you are building.",
    addLabel: "Add business",
    emptyMessage: "Add a company, website, or venture your audience should know.",
    fields: [
      { name: "name", label: "Business Name", required: true, placeholder: "House of X" },
      { name: "description", label: "Description", type: "textarea", placeholder: "What it does and why it exists." },
      { name: "website_url", label: "Website URL", type: "url", placeholder: "https://business.com" }
    ],
    renderPreview: (item) => {
      const business = item as Business;
      return (
        <div>
          <div className="font-medium text-foreground">{business.name}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {business.description || (business.website_url ? formatUrl(business.website_url) : "No description added")}
          </div>
        </div>
      );
    }
  },
  {
    section: "My Gear",
    key: "gear",
    title: "My Gear",
    description: "Share the tools, books, and setup details people actually ask about.",
    addLabel: "Add gear",
    emptyMessage: "Add the first tool from your creator operating system.",
    fields: [
      { name: "name", label: "Gear Name", required: true, placeholder: "Sony A7 IV" },
      { name: "category", label: "Category", placeholder: "Camera" },
      { name: "creator_note", label: "Creator Note", type: "textarea", placeholder: "Why you trust this and what it solves." },
      { name: "buy_url", label: "Buy / View URL", type: "url", placeholder: "https://store.com/product" }
    ],
    renderPreview: (item) => {
      const gearItem = item as GearItem;
      return (
        <div>
          <div className="font-medium text-foreground">{gearItem.name}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {gearItem.creator_note || gearItem.category || "No creator note added"}
          </div>
        </div>
      );
    }
  }
];

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}`;
}

function reorderItems<T extends { id: string; sort_order?: number }>(items: T[], fromId: string, toId: string) {
  const next = [...items];
  const fromIndex = next.findIndex((item) => item.id === fromId);
  const toIndex = next.findIndex((item) => item.id === toId);

  if (fromIndex === -1 || toIndex === -1) return items;

  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next.map((item, index) => ({ ...item, sort_order: index }));
}

function validateFields(values: FormValue, fields: FieldConfig[]) {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = values[field.name]?.trim() ?? "";

    if (field.required && !value) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }

    if (value && field.type === "url") {
      try {
        new URL(value);
      } catch {
        errors[field.name] = `Enter a valid ${field.label.toLowerCase()}.`;
      }
    }
  }

  return errors;
}

function getConfig(section: Section) {
  return collectionConfigs.find((item) => item.section === section);
}

function getCollectionLabel(key: CollectionKey) {
  return collectionConfigs.find((item) => item.key === key)?.title ?? key.replace(/_/g, " ");
}

export function DashboardShell({ initialProfile }: { initialProfile: Profile }) {
  const supabase = useMemo(() => {
    if (!hasSupabaseEnv()) return null;
    return createSupabaseBrowserClient();
  }, []);
  const isLiveProfile = isUuid(initialProfile.id);
  const [activeSection, setActiveSection] = useState<Section>("Overview");
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [copied, setCopied] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    full_name: initialProfile.full_name,
    username: initialProfile.username,
    niche: initialProfile.niche ?? "Podcaster",
    bio: initialProfile.bio ?? "",
    followers_count: initialProfile.followers_count ?? "",
    views_count: initialProfile.views_count ?? "",
    established_year: initialProfile.established_year ?? "",
    business_email: initialProfile.business_email ?? "",
    business_phone: initialProfile.business_phone ?? "",
    location: initialProfile.location ?? "",
    avatar_url: initialProfile.avatar_url ?? ""
  });
  const deferredUsername = useDeferredValue(profileForm.username);
  const [availability, setAvailability] = useState<AvailabilityState>("available");
  const [accountState, setAccountState] = useState({ email: "", password: "", deleting: false });

  const counts = {
    latest: profile.latest_links?.length ?? 0,
    socials: profile.socials?.length ?? 0,
    brands: profile.brands?.length ?? 0,
    businesses: profile.businesses?.length ?? 0,
    gear: profile.gear?.length ?? 0
  };

  const completion = useMemo(() => {
    const fields = [
      profile.full_name,
      profile.username,
      profile.bio,
      profile.niche,
      profile.avatar_url,
      profile.followers_count,
      profile.views_count,
      profile.established_year,
      profile.business_email,
      profile.business_phone,
      profile.location,
      counts.latest > 0 ? "1" : "",
      counts.socials > 0 ? "1" : "",
      counts.gear > 0 ? "1" : ""
    ];
    const complete = fields.filter((item) => item && String(item).trim()).length;
    return Math.round((complete / fields.length) * 100);
  }, [counts.gear, counts.latest, counts.socials, profile]);

  const missingItems = [
    !profile.bio ? "bio" : null,
    !profile.niche ? "niche" : null,
    !counts.socials ? "socials" : null,
    !counts.gear ? "gear" : null,
    !profile.business_email ? "business email" : null
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (!deferredUsername.trim()) {
      setAvailability("invalid");
      return;
    }

    if (deferredUsername === initialProfile.username) {
      setAvailability("available");
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setAvailability("checking");

      try {
        const response = await fetch(
          `/api/username-check?username=${encodeURIComponent(deferredUsername)}`,
          {
            signal: controller.signal
          }
        );
        const data = (await response.json()) as { available: boolean; valid: boolean };
        setAvailability(data.valid ? (data.available ? "available" : "taken") : "invalid");
      } catch {
        setAvailability("idle");
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [deferredUsername, initialProfile.username]);

  async function handleShareProfile() {
    const url = `https://gearin.in/${profile.username}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function handleSettingsSave() {
    setSettingsSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    const nextProfile = {
      ...profile,
      ...profileForm
    };
    setProfile((current) => ({
      ...current,
      ...profileForm
    }));

    if (supabase && isLiveProfile) {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: nextProfile.full_name,
          username: nextProfile.username,
          niche: nextProfile.niche,
          bio: nextProfile.bio,
          avatar_url: nextProfile.avatar_url,
          followers_count: nextProfile.followers_count,
          views_count: nextProfile.views_count,
          established_year: nextProfile.established_year,
          business_email: nextProfile.business_email,
          business_phone: nextProfile.business_phone,
          location: nextProfile.location
        })
        .eq("id", profile.id);

      setSyncMessage(error ? error.message : "Profile synced to Supabase.");
    }

    setSettingsSaving(false);
  }

  async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setProfileForm((current) => ({
      ...current,
      avatar_url: objectUrl
    }));

    if (!supabase || !isLiveProfile) return;

    setUploadingAvatar(true);
    const extension = file.name.split(".").pop() ?? "jpg";
    const filePath = `${profile.id}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from("avatars").upload(filePath, file, {
      upsert: true
    });

    if (error) {
      setSyncMessage(error.message);
      setUploadingAvatar(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setProfileForm((current) => ({
      ...current,
      avatar_url: data.publicUrl
    }));
    setSyncMessage("Avatar uploaded.");
    setUploadingAvatar(false);
  }

  function syncCollection(key: CollectionKey, items: EditableItem[]) {
    setProfile((current) => ({ ...current, [key]: items }));
    setSyncMessage(`${getCollectionLabel(key)} saved.`);

    if (!supabase || !isLiveProfile) return;

    void (async () => {
      const { error: deleteError } = await supabase.from(key).delete().eq("profile_id", profile.id);

      if (deleteError) {
        setSyncMessage(deleteError.message);
        return;
      }

      if (!items.length) {
        setSyncMessage(`${getCollectionLabel(key)} synced.`);
        return;
      }

      const rows = items.map((item, index) => ({
        ...item,
        sort_order: index,
        profile_id: profile.id,
        id: isUuid(item.id) ? item.id : crypto.randomUUID()
      }));

      const { error: insertError } = await supabase.from(key).insert(rows);
      setSyncMessage(insertError ? insertError.message : `${getCollectionLabel(key)} synced.`);
    })();
  }

  const config = getConfig(activeSection);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar active={activeSection} onSelect={setActiveSection} />
      <div className="flex-1 pb-24 lg:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="no-scrollbar mb-6 flex gap-3 overflow-x-auto lg:hidden">
            {(["Overview", "Latest Links", "Socials", "Brands", "Business", "My Gear", "Settings"] as Section[]).map(
              (section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => setActiveSection(section)}
                  className={
                    section === activeSection
                      ? "shrink-0 rounded-full border border-accent bg-accent/10 px-4 py-2 text-sm text-foreground"
                      : "shrink-0 rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground"
                  }
                >
                  {section}
                </button>
              )
            )}
          </div>

          {syncMessage && activeSection !== "Settings" ? (
            <p className="mb-6 text-sm text-muted-foreground">{syncMessage}</p>
          ) : null}

          {activeSection === "Overview" ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Badge className="border-accent/20 bg-accent/10 text-accent">Creator workspace</Badge>
                    <Badge>{isLiveProfile ? "Supabase connected" : "Live preview mode"}</Badge>
                  </div>
                  <h1 className="mt-4 font-heading text-4xl font-bold tracking-[-0.02em] text-foreground">
                    Good morning, {profile.full_name.split(" ")[0]}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Manage your profile like a product: clear signals, crisp distribution, and one link that carries your whole world.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="secondary">
                    <Link href={`/${profile.username}`} target="_blank">
                      <ExternalLink className="size-4" />
                      View my profile
                    </Link>
                  </Button>
                  <Button onClick={() => void handleShareProfile()}>
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? "Copied" : "Share profile"}
                  </Button>
                </div>
              </div>

              <QuickAddComposer
                configs={collectionConfigs}
                getItems={(key) => (profile[key] as EditableItem[] | undefined) ?? []}
                onSave={(key, items) => syncCollection(key, items)}
              />

              <Card className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Profile completion</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {missingItems.length
                        ? `Still missing ${missingItems.join(", ")}.`
                        : "Your profile is in strong shape."}
                    </p>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">{completion}%</div>
                </div>
                <div className="mt-4 h-3 rounded-full bg-muted">
                  <div
                    className="h-3 rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Latest links" value={counts.latest} />
                <StatCard label="Socials" value={counts.socials} />
                <StatCard label="Brands" value={counts.brands} />
                <StatCard label="Gear items" value={counts.gear} />
              </div>
            </div>
          ) : null}

          {config ? (
            <CollectionEditor
              key={config.key}
              config={config}
              items={(profile[config.key] as EditableItem[] | undefined) ?? []}
              onSave={(items) => syncCollection(config.key, items)}
            />
          ) : null}

          {activeSection === "Settings" ? (
            <div className="space-y-6">
              <div>
                <h1 className="font-heading text-4xl font-bold tracking-[-0.02em] text-foreground">
                  Profile Settings
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Fine-tune how your identity looks, reads, and gets discovered.
                </p>
              </div>

              <Card className="p-6">
                <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                  <div>
                    <p className="text-sm font-medium text-foreground">Profile picture</p>
                    <label className="mt-4 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center">
                      {profileForm.avatar_url ? (
                        <Avatar src={profileForm.avatar_url} alt={profileForm.full_name} size="xl" className="size-24" />
                      ) : (
                        <div className="flex size-20 items-center justify-center rounded-full border border-border bg-card">
                          <Upload className="size-6 text-accent" />
                        </div>
                      )}
                      <span className="mt-5 text-sm font-medium text-foreground">Drag and drop or click to upload</span>
                      <span className="mt-2 text-xs text-muted-foreground">
                        {uploadingAvatar ? "Uploading to Supabase Storage..." : "PNG, JPG, WEBP up to 5 MB"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => void handleAvatarUpload(event)}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name">
                      <Input
                        value={profileForm.full_name}
                        onChange={(event) =>
                          setProfileForm((current) => ({ ...current, full_name: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Username">
                      <div>
                        <Input
                          value={profileForm.username}
                          onChange={(event) =>
                            setProfileForm((current) => ({
                              ...current,
                              username: sanitizeUsername(event.target.value)
                            }))
                          }
                        />
                        <div className="mt-2 min-h-5 text-xs">
                          {availability === "checking" ? (
                            <span className="inline-flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="size-3.5 animate-spin" />
                              Checking availability
                            </span>
                          ) : null}
                          {availability === "available" ? (
                            <span className="inline-flex items-center gap-2 text-success">
                              <Check className="size-3.5" />
                              Available
                            </span>
                          ) : null}
                          {availability === "taken" ? (
                            <span className="text-red-400">This username is already taken.</span>
                          ) : null}
                          {availability === "invalid" ? (
                            <span className="text-red-400">
                              Username must be 3-20 characters with lowercase letters, numbers, or underscores.
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Field>
                    <Field label="Niche">
                      <Select
                        value={profileForm.niche}
                        onChange={(event) =>
                          setProfileForm((current) => ({ ...current, niche: event.target.value }))
                        }
                      >
                        {niches.map((niche) => (
                          <option key={niche} value={niche}>
                            {niche}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Established Year">
                      <Input
                        value={profileForm.established_year}
                        onChange={(event) =>
                          setProfileForm((current) => ({ ...current, established_year: event.target.value }))
                        }
                        placeholder="2019"
                      />
                    </Field>
                    <Field label="Followers Count">
                      <Input
                        value={profileForm.followers_count}
                        onChange={(event) =>
                          setProfileForm((current) => ({ ...current, followers_count: event.target.value }))
                        }
                        placeholder="47M+"
                      />
                    </Field>
                    <Field label="Views Count">
                      <Input
                        value={profileForm.views_count}
                        onChange={(event) =>
                          setProfileForm((current) => ({ ...current, views_count: event.target.value }))
                        }
                        placeholder="3.4B"
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Bio">
                        <div>
                          <Textarea
                            value={profileForm.bio}
                            maxLength={160}
                            onChange={(event) =>
                              setProfileForm((current) => ({ ...current, bio: event.target.value }))
                            }
                          />
                          <p className="mt-2 text-right text-xs text-muted-foreground">
                            {profileForm.bio.length}/160
                          </p>
                        </div>
                      </Field>
                    </div>
                    <Field label="Business Email">
                      <Input
                        type="email"
                        value={profileForm.business_email}
                        onChange={(event) =>
                          setProfileForm((current) => ({ ...current, business_email: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Business Phone">
                      <Input
                        value={profileForm.business_phone}
                        onChange={(event) =>
                          setProfileForm((current) => ({ ...current, business_phone: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Location">
                      <Input
                        value={profileForm.location}
                        onChange={(event) =>
                          setProfileForm((current) => ({ ...current, location: event.target.value }))
                        }
                      />
                    </Field>
                  </div>
                </div>

                <Button
                  className="mt-6"
                  onClick={() => void handleSettingsSave()}
                  disabled={settingsSaving || !isValidUsername(profileForm.username)}
                >
                  {settingsSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {settingsSaving ? "Saving..." : "Save profile"}
                </Button>
                {syncMessage ? <p className="mt-3 text-sm text-muted-foreground">{syncMessage}</p> : null}
              </Card>

              <Card className="p-6">
                <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
                  Account settings
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Change email">
                    <Input
                      type="email"
                      placeholder="new@email.com"
                      value={accountState.email}
                      onChange={(event) => setAccountState((current) => ({ ...current, email: event.target.value }))}
                    />
                  </Field>
                  <Field label="Change password">
                    <Input
                      type="password"
                      placeholder="New password"
                      value={accountState.password}
                      onChange={(event) => setAccountState((current) => ({ ...current, password: event.target.value }))}
                    />
                  </Field>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="secondary">
                    <Mail className="size-4" />
                    Update email
                  </Button>
                  <Button variant="secondary">Update password</Button>
                </div>
              </Card>

              <Card className="border-red-500/20 bg-red-500/5 p-6">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="mt-1 size-5 text-red-300" />
                  <div>
                    <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
                      Danger zone
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      Delete your account and remove your public profile. This action requires confirmation in your real auth flow.
                    </p>
                    <Button
                      variant="danger"
                      className="mt-6"
                      onClick={() =>
                        setAccountState((current) => ({
                          ...current,
                          deleting: !current.deleting
                        }))
                      }
                    >
                      <Trash2 className="size-4" />
                      {accountState.deleting ? "Confirm delete account" : "Delete account"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
      <BottomNav active={activeSection} onSelect={setActiveSection} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-3 font-heading text-4xl font-bold tracking-[-0.02em] text-foreground">{value}</div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function QuickAddComposer({
  configs,
  getItems,
  onSave
}: {
  configs: CollectionConfig[];
  getItems: (key: CollectionKey) => EditableItem[];
  onSave: (key: CollectionKey, items: EditableItem[]) => void;
}) {
  const [selectedKey, setSelectedKey] = useState<CollectionKey>("latest_links");
  const [formValues, setFormValues] = useState<FormValue>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const selectedConfig = configs.find((config) => config.key === selectedKey) ?? configs[0];

  function handleSelect(key: CollectionKey) {
    setSelectedKey(key);
    setFormValues({});
    setErrors({});
  }

  function updateField(name: string, value: string) {
    const nextValues = { ...formValues, [name]: value };
    setFormValues(nextValues);
    setErrors(validateFields(nextValues, selectedConfig.fields));
  }

  async function submit() {
    const nextErrors = validateFields(formValues, selectedConfig.fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));

    const items = getItems(selectedConfig.key);
    const payload = {
      id: generateId(),
      sort_order: items.length,
      ...formValues
    } as EditableItem;

    onSave(
      selectedConfig.key,
      [...items, payload].map((item, index) => ({ ...item, sort_order: index }))
    );

    setFormValues({});
    setErrors({});
    setSaving(false);
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
            Quick add
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Keep fresh drops, accounts, partners, ventures, and gear moving from one place.
          </p>
        </div>
        <div className="w-full lg:w-56">
          <Field label="Tag">
            <Select
              value={selectedKey}
              onChange={(event) => handleSelect(event.target.value as CollectionKey)}
            >
              {configs.map((config) => (
                <option key={config.key} value={config.key}>
                  {config.title}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {selectedConfig.fields.map((field) => (
          <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
            <Field label={field.label}>
              <div>
                {field.type === "textarea" ? (
                  <Textarea
                    value={formValues[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => updateField(field.name, event.target.value)}
                  />
                ) : (
                  <Input
                    type={field.type === "url" ? "url" : "text"}
                    value={formValues[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => updateField(field.name, event.target.value)}
                  />
                )}
                {errors[field.name] ? (
                  <p className="mt-2 text-xs text-red-400">{errors[field.name]}</p>
                ) : null}
              </div>
            </Field>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => void submit()} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          {saving ? "Posting..." : `Post to ${selectedConfig.title}`}
        </Button>
      </div>
    </Card>
  );
}

function CollectionEditor({
  config,
  items,
  onSave
}: {
  config: CollectionConfig;
  items: EditableItem[];
  onSave: (items: EditableItem[]) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValue>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function openForCreate() {
    setEditingId(null);
    setFormValues({});
    setErrors({});
    setModalOpen(true);
  }

  function openForEdit(item: EditableItem) {
    setEditingId(item.id);
    const entry = item as Record<string, string | number | null | undefined>;
    const nextValues = Object.fromEntries(
      config.fields.map((field) => [field.name, String(entry[field.name] ?? "")])
    );
    setFormValues(nextValues);
    setErrors({});
    setModalOpen(true);
  }

  function updateField(name: string, value: string) {
    const nextValues = { ...formValues, [name]: value };
    setFormValues(nextValues);
    setErrors(validateFields(nextValues, config.fields));
  }

  async function submit() {
    const nextErrors = validateFields(formValues, config.fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));

    const payload = {
      id: editingId ?? generateId(),
      sort_order: editingId
        ? items.find((item) => item.id === editingId)?.sort_order ?? items.length
        : items.length,
      ...formValues
    } as EditableItem;

    const nextItems = editingId
      ? items.map((item) => (item.id === editingId ? payload : item))
      : [...items, payload];

    onSave(nextItems.map((item, index) => ({ ...item, sort_order: index })));
    setSaving(false);
    setModalOpen(false);
  }

  function remove(id: string) {
    onSave(items.filter((item) => item.id !== id).map((item, index) => ({ ...item, sort_order: index })));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetId: string) {
    event.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    onSave(reorderItems(items, draggedId, targetId));
    setDraggedId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-[-0.02em] text-foreground">
            {config.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{config.description}</p>
        </div>
        <Button onClick={openForCreate}>
          <Plus className="size-4" />
          {config.addLabel}
        </Button>
      </div>

      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              draggable
              onDragStart={() => setDraggedId(item.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, item.id)}
              className="group flex flex-col gap-4 p-4 hover:border-[#333333] hover:shadow-glow sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="cursor-grab rounded-lg border border-border bg-muted p-2 text-muted-foreground">
                  <GripVertical className="size-4" />
                </div>
                <div>{config.renderPreview(item)}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openForEdit(item)} aria-label="Edit item">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(item.id)} aria-label="Delete item">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">{config.emptyMessage}</p>
          <Button className="mt-6" onClick={openForCreate}>
            <Plus className="size-4" />
            {config.addLabel}
          </Button>
        </Card>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? `Edit ${config.addLabel.replace("Add ", "")}` : config.addLabel}
        description="Make the update here and it will immediately sharpen your public profile."
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          {config.fields.map((field) => (
            <Field key={field.name} label={field.label}>
              <div>
                {field.type === "textarea" ? (
                  <Textarea
                    value={formValues[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => updateField(field.name, event.target.value)}
                  />
                ) : (
                  <Input
                    type={field.type === "url" ? "url" : "text"}
                    value={formValues[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => updateField(field.name, event.target.value)}
                  />
                )}
                {errors[field.name] ? (
                  <p className="mt-2 text-xs text-red-400">{errors[field.name]}</p>
                ) : null}
              </div>
            </Field>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
