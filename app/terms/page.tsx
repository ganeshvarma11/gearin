import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="p-8">
        <h1 className="font-heading text-4xl font-bold tracking-[-0.02em] text-foreground">
          Terms
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Gearin is built for creators to present accurate identity, business, and recommendation information in a single trusted destination.
          By using the platform, creators confirm they have rights to publish the links, brand references, and contact details shown on their profiles.
        </p>
      </Card>
    </main>
  );
}
