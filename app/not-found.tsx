import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg p-8 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">404</p>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-[-0.02em] text-foreground">
          Creator not found
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          That Gearin profile does not exist yet. Search for another creator or claim the username
          for yourself.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Back home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/signup">Claim your profile</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
