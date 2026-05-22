import Image from "next/image";

import { createInitials, cn } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "size-10",
  md: "size-14",
  lg: "size-20",
  xl: "size-24"
};

const pixels = {
  sm: 40,
  md: 56,
  lg: 80,
  xl: 96
};

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border border-accent/30 bg-muted text-sm font-semibold text-foreground transition-all duration-200 hover:border-accent/80",
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${pixels[size]}px`}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          {createInitials(alt)}
        </div>
      )}
    </div>
  );
}
