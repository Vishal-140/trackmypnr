"use client";

import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{description}</p>
    </div>
  );
}
