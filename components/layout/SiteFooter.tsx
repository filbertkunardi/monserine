"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { COUNTRIES } from "@/lib/countries";

const FOOTER_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/support", label: "Support" },
  { href: "/connect", label: "Connect" },
  { href: "/terms", label: "Terms" },
];

function CurrencySelector({ currentCountry }: { currentCountry: string }) {
  const router = useRouter();
  const [country, setCountry] = useState(currentCountry);
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    setCountry(next);
    startTransition(async () => {
      await fetch("/api/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: next }),
      });
      router.refresh();
    });
  }

  return (
    <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] text-footerLink">
      Currency
      <select
        value={country}
        disabled={isPending}
        onChange={(e) => onChange(e.target.value)}
        className="border border-footerLink/40 bg-dark px-2 py-1 text-[11px] normal-case tracking-normal text-footerLink disabled:opacity-60"
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code} className="bg-cream text-dark">
            {c.name} ({c.currency})
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SiteFooter({ currentCountry }: { currentCountry: string }) {
  return (
    <div className="flex flex-col items-center gap-5 bg-dark px-[clamp(20px,5vw,56px)] py-[clamp(32px,6vw,56px)] text-center">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="Monserine"
          width={78}
          height={26}
          className="h-[26px] w-auto object-contain brightness-200 invert"
        />
      </Link>
      <div className="flex flex-wrap justify-center gap-5 text-xs font-medium uppercase tracking-[0.05em] text-footerLink">
        {FOOTER_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-footerLink">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://www.instagram.com/monserine/"
          target="_blank"
          rel="noopener"
          className="flex items-center text-footerLink"
          aria-label="Instagram"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@monserine"
          target="_blank"
          rel="noopener"
          className="flex items-center text-footerLink"
          aria-label="TikTok"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.6 5.82c-.83-.73-1.36-1.75-1.46-2.82h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.43 0-2.6-1.16-2.6-2.6a2.6 2.6 0 0 1 2.6-2.6c.26 0 .5.03.74.1V9.63a5.9 5.9 0 0 0-.74-.04c-3.26 0-5.9 2.64-5.9 5.9s2.64 5.9 5.9 5.9 5.9-2.64 5.9-5.9V9.53a7.15 7.15 0 0 0 4.13 1.3V7.44a4.85 4.85 0 0 1-2.89-1.62z" />
          </svg>
        </a>
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mt-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-footerLink"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9C2B8" strokeWidth="2">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
        Back to Top
      </button>
      <CurrencySelector currentCountry={currentCountry} />
      <div className="mt-1 text-[11px] text-copyright">© 2026 Monserine</div>
    </div>
  );
}
