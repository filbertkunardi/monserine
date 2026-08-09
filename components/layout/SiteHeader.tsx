"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/support", label: "Support" },
  { href: "/connect", label: "Connect" },
];

const SHOP_CATEGORIES = [
  { href: "/shop", label: "All" },
  { href: "/shop?category=tops", label: "Tops" },
  { href: "/shop?category=dresses", label: "Dresses" },
  { href: "/shop?category=skirts-and-skorts", label: "Skirts and Skorts" },
  { href: "/shop?category=sets", label: "Sets" },
  { href: "/shop?category=outerwear", label: "Outerwear" },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2B2926"
      strokeWidth="2.2"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="1.8">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

function CartLink({ cartCount }: { cartCount: number }) {
  return (
    <Link href="/cart" className="relative flex text-dark">
      <BagIcon />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-dark text-[9px] font-semibold text-cream">
          {cartCount}
        </span>
      )}
    </Link>
  );
}

export default function SiteHeader({ cartCount }: { cartCount: number }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileFormRef = useRef<HTMLFormElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (desktopSearchOpen) desktopInputRef.current?.focus();
  }, [desktopSearchOpen]);

  useEffect(() => {
    if (mobileSearchOpen) mobileInputRef.current?.focus();
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (mobileFormRef.current && !mobileFormRef.current.contains(e.target as Node)) {
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (!shopMenuOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target as Node)) {
        setShopMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [shopMenuOpen]);

  function runSearch(value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed) return false;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    return true;
  }

  function handleDesktopIconClick() {
    if (!desktopSearchOpen) {
      setDesktopSearchOpen(true);
      return;
    }
    if (runSearch(desktopInputRef.current?.value ?? "")) {
      setDesktopSearchOpen(false);
    } else {
      desktopInputRef.current?.focus();
    }
  }

  function handleDesktopSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (runSearch(desktopInputRef.current?.value ?? "")) setDesktopSearchOpen(false);
  }

  function handleMobileIconClick() {
    if (runSearch(mobileInputRef.current?.value ?? "")) {
      setMobileSearchOpen(false);
    } else {
      mobileInputRef.current?.focus();
    }
  }

  function handleMobileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (runSearch(mobileInputRef.current?.value ?? "")) setMobileSearchOpen(false);
  }

  return (
    <div className="bg-cream">
      <div className="bg-dark px-2 py-[9px] text-center text-xs font-medium tracking-[0.08em] text-cream">
        HOUSE OF MONSERINE - SIGN UP FOR 10% OFF
      </div>

      {/* Desktop nav */}
      <div className="hidden min-[761px]:grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-black/[0.06] bg-cream px-[clamp(20px,5vw,56px)] py-[18px]">
        <div className="flex flex-wrap items-center justify-self-start gap-5 text-xs font-medium uppercase tracking-[0.04em]">
          <Link href="/" aria-label="Home" className="flex items-center">
            <HomeIcon />
          </Link>
          <div ref={shopMenuRef} className="relative">
            <button
              onClick={() => setShopMenuOpen((v) => !v)}
              className="flex items-center gap-1 uppercase tracking-[0.04em]"
            >
              Shop
              <ChevronIcon open={shopMenuOpen} />
            </button>
            {shopMenuOpen && (
              <div className="absolute left-0 top-full z-20 mt-3 flex w-[200px] flex-col border border-black/[0.08] bg-cream py-2 shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
                {SHOP_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setShopMenuOpen(false)}
                    className="px-4 py-2 text-[13px] normal-case tracking-normal text-dark hover:bg-creamPanel"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/" className="flex items-center justify-self-center">
          <Image src="/images/logo.png" alt="Monserine" width={96} height={32} className="h-[clamp(24px,4vw,32px)] w-auto object-contain" />
        </Link>
        <div className="flex items-center justify-self-end gap-[18px]">
          <form onSubmit={handleDesktopSubmit} className="flex items-center">
            <input
              ref={desktopInputRef}
              type="search"
              placeholder="Search products"
              aria-hidden={!desktopSearchOpen}
              tabIndex={desktopSearchOpen ? 0 : -1}
              className={`border-b border-dark/25 bg-transparent text-sm text-dark placeholder:text-body transition-[width,opacity,margin] duration-300 ease-out focus:outline-none ${
                desktopSearchOpen ? "mr-3 w-[220px] opacity-100" : "mr-0 w-0 opacity-0"
              }`}
            />
            <button type="button" aria-label="Search" onClick={handleDesktopIconClick} className="flex text-dark">
              <SearchIcon />
            </button>
          </form>
          <CartLink cartCount={cartCount} />
          <Link href="/account" className="flex text-dark">
            <AccountIcon />
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex h-[54px] min-[761px]:hidden items-center gap-3 border-b border-black/[0.06] bg-cream px-5">
        <button
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
          className="flex w-[22px] shrink-0 flex-col gap-[5px]"
        >
          <span className="h-0.5 w-full bg-dark" />
          <span className="h-0.5 w-full bg-dark" />
          <span className="h-0.5 w-full bg-dark" />
        </button>

        {mobileSearchOpen ? (
          <form
            ref={mobileFormRef}
            onSubmit={handleMobileSubmit}
            className="flex flex-1 animate-search-in items-center gap-3"
          >
            <input
              ref={mobileInputRef}
              type="search"
              placeholder="Search products"
              className="h-5 w-full min-w-0 border-none bg-transparent p-0 text-sm leading-5 text-dark placeholder:text-body focus:outline-none"
            />
            <button type="button" aria-label="Search" onClick={handleMobileIconClick} className="flex shrink-0 text-dark">
              <SearchIcon />
            </button>
          </form>
        ) : (
          <>
            <button aria-label="Search" onClick={() => setMobileSearchOpen(true)} className="flex shrink-0 text-dark">
              <SearchIcon />
            </button>
            <Link href="/" className="flex flex-1 items-center justify-center">
              <Image src="/images/logo.png" alt="Monserine" width={66} height={22} className="h-[22px] w-auto object-contain" />
            </Link>
          </>
        )}

        <div className="flex shrink-0 items-center gap-4">
          <CartLink cartCount={cartCount} />
          <Link href="/account" className="flex text-dark">
            <AccountIcon />
          </Link>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity ${
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed left-0 top-0 z-50 flex h-screen w-[78vw] max-w-[300px] flex-col bg-cream p-6 shadow-[2px_0_20px_rgba(0,0,0,0.12)] transition-transform duration-[280ms] ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="self-end p-1.5 text-[22px]">
          ×
        </button>
        <div className="mt-6 flex flex-col gap-[26px] text-[15px] font-medium uppercase tracking-[0.04em]">
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            Home
          </Link>
          <div className="flex flex-col gap-[18px]">
            <button
              onClick={() => setMobileShopOpen((v) => !v)}
              className="flex items-center justify-between"
            >
              <span>Shop</span>
              <ChevronIcon open={mobileShopOpen} />
            </button>
            {mobileShopOpen && (
              <div className="flex flex-col gap-[18px] pl-4 text-[13px] normal-case tracking-normal text-body">
                {SHOP_CATEGORIES.map((cat) => (
                  <Link key={cat.href} href={cat.href} onClick={() => setSidebarOpen(false)}>
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
