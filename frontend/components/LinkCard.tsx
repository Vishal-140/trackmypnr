import Link from 'next/link';

interface LinkCardProps {
  href: string;
  title: string;
  description: string;
}

export default function LinkCard({ href, title, description }: LinkCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand"
    >
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{description}</p>
      <span className="mt-3 inline-block text-sm font-medium text-brand">Read the guide →</span>
    </Link>
  );
}
