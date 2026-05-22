import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Profile } from "@/types";

export function ContactSection({ profile }: { profile: Profile }) {
  const hasContact = profile.business_email || profile.business_phone || profile.location;

  if (!hasContact) return null;

  return (
    <section id="business-enquiries" className="scroll-mt-24 py-10 sm:py-14">
      <Card className="p-6 sm:p-8">
        <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-foreground">
          Business Enquiries
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {profile.business_email ? (
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <Mail className="size-4 text-accent" />
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
              <p className="mt-2 text-sm text-foreground">{profile.business_email}</p>
            </div>
          ) : null}
          {profile.business_phone ? (
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <Phone className="size-4 text-accent" />
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
              <p className="mt-2 text-sm text-foreground">{profile.business_phone}</p>
            </div>
          ) : null}
          {profile.location ? (
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <MapPin className="size-4 text-accent" />
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Location</p>
              <p className="mt-2 text-sm text-foreground">{profile.location}</p>
            </div>
          ) : null}
        </div>
        {profile.business_email ? (
          <Button asChild className="mt-6">
            <a href={`mailto:${profile.business_email}`}>Send Email</a>
          </Button>
        ) : null}
      </Card>
    </section>
  );
}
