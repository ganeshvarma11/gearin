"use client";

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

type SearchBarProps = {
  initialCreators: Profile[];
};

export function SearchBar({ initialCreators }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, startTransition] = useTransition();
  const [showDropdown, setShowDropdown] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const fallbackResults = useMemo(() => initialCreators.slice(0, 5), [initialCreators]);

  useEffect(() => {
    if (!deferredQuery.trim()) {
      setResults(fallbackResults);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      startTransition(() => {
        void (async () => {
          try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(deferredQuery)}`, {
              signal: controller.signal
            });
            const data = (await response.json()) as { results: Profile[] };
            setResults(data.results ?? []);
          } catch {
            setResults([]);
          }
        })();
      });
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [deferredQuery, fallbackResults]);

  const visibleResults = query.trim() ? results : fallbackResults;

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl border border-input bg-card/95 p-2 shadow-soft backdrop-blur-sm">
        <div className="flex items-center gap-3 rounded-xl border border-transparent bg-transparent px-3">
          <Search className="size-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => {
              setShowDropdown(true);
              setResults(fallbackResults);
            }}
            onBlur={() => {
              window.setTimeout(() => setShowDropdown(false), 120);
            }}
            placeholder="Search any creator..."
            className="h-14 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search creators"
          />
          <div className="hidden items-center gap-2 rounded-full border border-border bg-muted px-3 py-2 text-xs text-muted-foreground sm:flex">
            <Sparkles className="size-3.5 text-accent" />
            Live discovery
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute left-0 right-0 top-[calc(100%+12px)] z-20 overflow-hidden rounded-2xl border border-border bg-card/95 shadow-soft backdrop-blur-md transition-all duration-200",
          showDropdown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="border-b border-border px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Search results
        </div>

        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleResults.length ? (
          <div className="p-2">
            {visibleResults.map((creator) => (
              <Link
                key={creator.id}
                href={`/${creator.username}`}
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 hover:bg-white/5"
              >
                <Avatar src={creator.avatar_url} alt={creator.full_name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">
                    {creator.full_name}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      @{creator.username}
                    </span>
                    {creator.niche ? <Badge>{creator.niche}</Badge> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No creators found
          </div>
        )}
      </div>
    </div>
  );
}
