create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid references auth.users primary key,
  username text unique not null check (username ~ '^[a-z0-9_]{3,20}$'),
  full_name text,
  bio text,
  niche text,
  avatar_url text,
  followers_count text,
  views_count text,
  established_year text,
  business_email text,
  business_phone text,
  location text,
  is_verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.latest_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  description text,
  thumbnail_url text,
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  platform text not null,
  handle text not null,
  url text,
  followers_count text,
  sort_order integer default 0
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  logo_url text,
  website_url text,
  sort_order integer default 0
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  website_url text,
  sort_order integer default 0
);

create table if not exists public.gear (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  category text,
  creator_note text,
  buy_url text,
  sort_order integer default 0
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    username,
    full_name,
    niche,
    avatar_url,
    business_email
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', replace(split_part(new.email, '@', 1), '.', '_')),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'niche', 'Other'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.latest_links enable row level security;
alter table public.socials enable row level security;
alter table public.brands enable row level security;
alter table public.businesses enable row level security;
alter table public.gear enable row level security;

drop policy if exists "profiles are public readable" on public.profiles;
create policy "profiles are public readable"
on public.profiles for select
using (true);

drop policy if exists "profile owners can manage their profile" on public.profiles;
create policy "profile owners can manage their profile"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "latest links are public readable" on public.latest_links;
create policy "latest links are public readable"
on public.latest_links for select
using (true);

drop policy if exists "profile owners can manage latest links" on public.latest_links;
create policy "profile owners can manage latest links"
on public.latest_links for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

drop policy if exists "socials are public readable" on public.socials;
create policy "socials are public readable"
on public.socials for select
using (true);

drop policy if exists "profile owners can manage socials" on public.socials;
create policy "profile owners can manage socials"
on public.socials for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

drop policy if exists "brands are public readable" on public.brands;
create policy "brands are public readable"
on public.brands for select
using (true);

drop policy if exists "profile owners can manage brands" on public.brands;
create policy "profile owners can manage brands"
on public.brands for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

drop policy if exists "businesses are public readable" on public.businesses;
create policy "businesses are public readable"
on public.businesses for select
using (true);

drop policy if exists "profile owners can manage businesses" on public.businesses;
create policy "profile owners can manage businesses"
on public.businesses for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

drop policy if exists "gear is public readable" on public.gear;
create policy "gear is public readable"
on public.gear for select
using (true);

drop policy if exists "profile owners can manage gear" on public.gear;
create policy "profile owners can manage gear"
on public.gear for all
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

drop policy if exists "avatars are public readable" on storage.objects;
create policy "avatars are public readable"
on storage.objects for select
using (bucket_id = 'avatars');

drop policy if exists "users can upload their own avatars" on storage.objects;
create policy "users can upload their own avatars"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "users can update their own avatars" on storage.objects;
create policy "users can update their own avatars"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "users can delete their own avatars" on storage.objects;
create policy "users can delete their own avatars"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "thumbnails are public readable" on storage.objects;
create policy "thumbnails are public readable"
on storage.objects for select
using (bucket_id = 'thumbnails');

drop policy if exists "users can upload their own thumbnails" on storage.objects;
create policy "users can upload their own thumbnails"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'thumbnails'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "users can update their own thumbnails" on storage.objects;
create policy "users can update their own thumbnails"
on storage.objects for update
to authenticated
using (
  bucket_id = 'thumbnails'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'thumbnails'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "users can delete their own thumbnails" on storage.objects;
create policy "users can delete their own thumbnails"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'thumbnails'
  and auth.uid()::text = (storage.foldername(name))[1]
);
