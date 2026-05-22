import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Send,
  Twitter,
  Youtube
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Social } from "@/types";

const iconMap: Record<string, typeof Globe> = {
  instagram: Instagram,
  youtube: Youtube,
  x: Twitter,
  twitter: Twitter,
  facebook: Facebook,
  discord: MessageCircle,
  linkedin: Linkedin,
  telegram: Send,
  snapchat: Globe,
  tiktok: Globe
};

export function SocialsTab({ socials }: { socials: Social[] }) {
  if (!socials.length) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        Social channels have not been published yet.
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {socials.map((social) => {
        const Icon = iconMap[social.platform.toLowerCase()] ?? Globe;
        return (
          <Card
            key={social.id}
            className="flex flex-col justify-between p-5 hover:-translate-y-0.5 hover:border-[#333333] hover:shadow-glow"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-muted">
                <Icon className="size-4.5 text-accent" />
              </div>
              <p className="mt-5 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                {social.platform}
              </p>
              <h3 className="mt-2 text-lg font-medium text-foreground">{social.handle}</h3>
              {social.followers_count ? (
                <p className="mt-3 font-mono text-sm text-accent">{social.followers_count}</p>
              ) : null}
            </div>
            <Button asChild variant="secondary" className="mt-6 w-full">
              <a href={social.url ?? "#"} target="_blank" rel="noopener noreferrer">
                Follow
              </a>
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
