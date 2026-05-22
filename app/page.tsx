import Link from "next/link";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

import { CreatorCard } from "@/components/home/creator-card";
import { HowItWorks } from "@/components/home/how-it-works";
import { HomeNavbar } from "@/components/home/navbar";
import { SearchBar } from "@/components/home/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFeaturedCreators } from "@/lib/data";

export default async function HomePage() {
  const creators = await getFeaturedCreators();

  return (
    <main>
      <HomeNavbar />

      <section className="relative overflow-hidden border-b border-border">
        <div className="hero-grid absolute inset-0 opacity-50" />
        <div className="mx-auto max-w-content px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="animate-fade-up border-accent/20 bg-accent/10 text-accent">
              ✦ The Creator Identity Platform
            </Badge>
            <h1 className="mt-8 animate-fade-up text-balance font-heading text-5xl font-bold tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl">
              Your entire world.
              <br />
              One link.
            </h1>
            <p
              className="mx-auto mt-6 max-w-2xl animate-fade-up text-balance text-base leading-7 text-muted-foreground sm:text-lg"
              style={{ animationDelay: "0.1s" }}
            >
              Stop saying &quot;link in bio.&quot; Give your followers one place to find your
              socials, gear, brands, and everything you do.
            </p>
            <div className="mt-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <SearchBar initialCreators={creators} />
            </div>
            <p
              className="mt-5 animate-fade-up text-sm text-muted-foreground"
              style={{ animationDelay: "0.3s" }}
            >
              Join 500+ creators already on Gearin
            </p>

            <div
              className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2">
                <Search className="size-4 text-accent" />
                Search feels instant
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2">
                <ShieldCheck className="size-4 text-accent" />
                Built for trust, clarity, and reach
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
              Featured creators
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
              Discover Creators
            </h2>
          </div>
          <Button asChild variant="secondary" className="hidden sm:inline-flex">
            <Link href="/signup">
              Join Gearin
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">How it works</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
              One profile for everything that makes a creator matter
            </h2>
          </div>
          <HowItWorks />
        </div>
      </section>

      <footer className="mx-auto flex max-w-content flex-col gap-6 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="font-heading text-lg font-bold text-foreground">Gearin</div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:hello@gearin.in">Contact</a>
        </div>
        <div>© 2025 Gearin. Built for creators.</div>
      </footer>
    </main>
  );
}
