import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gearin",
  description:
    "The creator identity platform for socials, gear, brands, business, and latest work."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background font-sans text-foreground antialiased">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%),rgb(var(--background))]">
          {children}
        </div>
      </body>
    </html>
  );
}
