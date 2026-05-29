"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Chrome, Loader2, X } from "lucide-react";

import { niches } from "@/lib/constants";
import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase-browser";
import { sanitizeUsername } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type AvailabilityState = "idle" | "checking" | "available" | "taken" | "invalid";

const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [niche, setNiche] = useState("Podcaster");
  const [username, setUsername] = useState("");
  const [availability, setAvailability] = useState<AvailabilityState>("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const deferredUsername = useDeferredValue(username);
  const supabase = hasSupabaseEnv() ? createSupabaseBrowserClient() : null;

  useEffect(() => {
    if (!fullName || username) return;
    setUsername(sanitizeUsername(fullName.replace(/\s+/g, "_")));
  }, [fullName, username]);

  useEffect(() => {
    if (!deferredUsername.trim()) {
      setAvailability("idle");
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
  }, [deferredUsername]);

  async function handleGoogleSignup() {
    if (!googleAuthEnabled) {
      setError("Google sign-in is not enabled yet. Create your account with email and password.");
      return;
    }

    if (!supabase) {
      setError("Add your Supabase environment variables to enable authentication.");
      return;
    }

    setLoading(true);
    setError("");

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

  async function handleSignup() {
    if (!supabase) {
      setError("Add your Supabase environment variables to enable authentication.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        data: {
          full_name: fullName,
          username,
          niche
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.href = "/dashboard";
      return;
    }

    setSuccess("Account created. Check your email to confirm and open your dashboard.");
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-lg p-6 sm:p-8">
      <Link href="/" className="font-heading text-3xl font-bold tracking-[-0.02em] text-foreground">
        Gearin
      </Link>
      <h1 className="mt-8 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground">
        Create your profile
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Set up your creator identity hub and give followers one place to understand everything you do.
      </p>

      <Button
        variant="secondary"
        className="mt-8 w-full justify-center border-white bg-white !text-zinc-950 shadow-soft hover:bg-zinc-100 disabled:opacity-90"
        onClick={() => void handleGoogleSignup()}
        disabled={loading}
        aria-label="Continue with Google"
      >
        <Chrome className="size-4" />
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Full Name</label>
          <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Aarav Sharma" />
        </div>
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
            placeholder="Choose a strong password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Username</label>
          <Input
            value={username}
            onChange={(event) => setUsername(sanitizeUsername(event.target.value))}
            placeholder="your_handle"
          />
          <div className="mt-2 flex min-h-5 items-center gap-2 text-xs">
            {availability === "checking" ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Checking availability</span>
              </>
            ) : null}
            {availability === "available" ? (
              <>
                <Check className="size-3.5 text-success" />
                <span className="text-success">available</span>
              </>
            ) : null}
            {availability === "taken" ? (
              <>
                <X className="size-3.5 text-red-400" />
                <span className="text-red-400">taken</span>
              </>
            ) : null}
            {availability === "invalid" ? (
              <span className="text-red-400">
                Use 3-20 lowercase letters, numbers, or underscores only.
              </span>
            ) : null}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Niche</label>
          <Select value={niche} onChange={(event) => setNiche(event.target.value)}>
            {niches.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      {success ? <p className="mt-4 text-sm text-success">{success}</p> : null}

      <Button
        className="mt-6 w-full justify-center"
        disabled={loading || !fullName || !email || !password || availability !== "available"}
        onClick={() => void handleSignup()}
        aria-label="Create my profile with email and password"
      >
        {loading ? "Creating profile..." : "Create my profile"}
      </Button>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        By continuing, you agree to Gearin&apos;s terms and privacy policy.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground">
          Log in
        </Link>
      </p>
    </Card>
  );
}
