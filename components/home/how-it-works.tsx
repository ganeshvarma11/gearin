import { ArrowRight, Link2, Orbit, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: Orbit,
    title: "Claim your profile",
    description: "Sign up, lock in your username, and establish the identity your audience can remember."
  },
  {
    icon: Sparkles,
    title: "Add everything",
    description: "Bring your socials, gear, brand deals, businesses, and latest links into one calm system."
  },
  {
    icon: Link2,
    title: "Share one link",
    description: "Followers stop hunting. Brands get clarity. Your entire world lives at one Gearin profile."
  }
];

export function HowItWorks() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <Card
            key={step.title}
            className="animate-fade-up p-6 hover:-translate-y-0.5 hover:border-[#333333] hover:shadow-glow"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="mb-8 flex size-12 items-center justify-center rounded-2xl border border-border bg-muted">
              <Icon className="size-5 text-accent" />
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Step {index + 1}
              <ArrowRight className="size-3.5" />
            </div>
            <h3 className="mt-4 font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
