# Gearin

Gearin is a creator identity platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Creators can publish one profile for their socials, gear, brand partnerships, businesses, and latest links.

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Storage

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local env file

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
```

Set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` only after Google is enabled under Authentication > Providers in Supabase.

If these values are missing, Gearin still runs in demo mode using local sample data, but authentication and live profile editing stay disabled.

### 3. Set up Supabase

Create a Supabase project, then run the SQL in [`supabase/schema.sql`](./supabase/schema.sql) inside the Supabase SQL editor.

This script creates:

- `profiles`
- `latest_links`
- `socials`
- `brands`
- `businesses`
- `gear`
- public storage buckets for `avatars` and `thumbnails`
- row-level security policies for both tables and storage

### 4. Configure auth redirect URLs

In your Supabase dashboard:

- Set the Site URL to your local app URL, usually `http://localhost:3000`
- Add `http://localhost:3000/auth/callback` to Additional Redirect URLs

If you enable Google auth, add the same callback URL in both Supabase and your Google OAuth client configuration.

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Notes

- Server-rendered auth reads are kept in sync with Supabase via [`middleware.ts`](./middleware.ts).
- Without Supabase env vars, the homepage, search, and profile pages fall back to demo content from [`lib/demo-data.ts`](./lib/demo-data.ts).
- The dashboard UI is wired for live profile and collection syncing when Supabase is configured.
