"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Chrome, KeyRound } from "lucide-react";

import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

export function LoginForm() {
  const supabase = useMemo(() => {
    if (!hasSupabaseEnv()) return null;
    return createSupabaseBrowserClient();
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    if (!googleAuthEnabled) {
      setError("Google sign-in is not enabled yet. Use email and password to sign in.");
      return;
    }

    if (!supabase) {
      setError("Add your Supabase environment variables to enable authentication.");
      return;
    }

    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  async function handleEmailLogin() {
    if (!supabase) {
      setError("Add your Supabase environment variables to enable authentication.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <Link href="/" className="font-heading text-3xl font-bold tracking-[-0.02em] text-foreground">
        Gearin
      </Link>
      <h1 className="mt-8 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground">
        Welcome back
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Sign in to manage your creator identity, latest drops, and everything your audience needs.
      </p>

      <Button
        variant="secondary"
        className="mt-8 w-full justify-center border-white bg-white !text-zinc-950 shadow-soft hover:bg-zinc-100 disabled:opacity-90"
        onClick={() => void handleGoogleLogin()}
        disabled={loading}
        aria-label="Sign in with Google"
      >
        <Chrome className="size-4" />
        Sign in with Google
      </Button>

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <Button
        className="mt-6 w-full justify-center"
        onClick={() => void handleEmailLogin()}
        disabled={loading || !email || !password}
        aria-label="Sign in with email and password"
      >
        <KeyRound className="size-4" />
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <Link href="/signup" className="text-muted-foreground transition-colors hover:text-foreground">
          Don&apos;t have an account? Join as a creator
        </Link>
        <a href="mailto:hello@gearin.in" className="text-muted-foreground transition-colors hover:text-foreground">
          Forgot password
        </a>
      </div>
    </Card>
  );
}
