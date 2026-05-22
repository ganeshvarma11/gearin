import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="p-8">
        <h1 className="font-heading text-4xl font-bold tracking-[-0.02em] text-foreground">
          Privacy
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Gearin stores only the profile information creators choose to publish and uses authentication details strictly to secure creator access.
          Public visitors can discover creator pages, while creators control business contact details, links, and gear recommendations from the dashboard.
        </p>
      </Card>
    </main>
  );
}
