"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, TrainFront } from "lucide-react";

import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Check PNR" },
  { href: "/dashboard", label: "My PNRs" },
  { href: "/pnr-status-guide", label: "PNR Guide" },
  { href: "/waitlist-types", label: "Waitlist Types" },
  { href: "/travel-classes", label: "Travel Classes" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
          <Image
            src="/logo.png"
            alt="trackmypnr logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg object-contain"
            priority
          />
          trackmypnr
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded-lg p-2 text-ink md:hidden"
          style={{ minHeight: 44, minWidth: 44 }}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface px-4 py-3 md:hidden" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-bg"
                  style={{ minHeight: 44 }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
