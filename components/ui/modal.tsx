"use client";

import type { ReactNode } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
              {title}
            </h3>
            {description ? (
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            )}
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
