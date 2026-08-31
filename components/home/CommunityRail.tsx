"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import Lightbox from "@/components/Lightbox";

type CommunityEntry = {
  username: string;
  productName: string;
  link: string;
  photos: string[];
};

const COMMUNITY: CommunityEntry[] = [
  {
    username: "@nadine_abigail_",
    productName: "Guizio Top",
    link: "/products/guizio-top",
    photos: [
      "/images/community/nadine_abigail_-1.jpg",
      "/images/community/nadine_abigail_-2.jpg",
      "/images/community/nadine_abigail_-3.jpg",
    ],
  },
  {
    username: "@aiko.chan",
    productName: "Muse Lace Top",
    link: "/products/muse-lace-top",
    photos: [
      "/images/community/aiko.chan-1.jpg",
      "/images/community/aiko.chan-2.jpg",
      "/images/community/aiko.chan-3.jpg",
      "/images/community/aiko.chan-4.jpg",
    ],
  },
  {
    username: "@devann3y",
    productName: "Muse Lace Top",
    link: "/products/muse-lace-top",
    photos: [
      "/images/community/devann3y-1.jpg",
      "/images/community/devann3y-2.jpg",
      "/images/community/devann3y-3.jpg",
      "/images/community/devann3y-4.jpg",
    ],
  },
  {
    username: "@joanneputri",
    productName: "Muse Lace Top",
    link: "/products/muse-lace-top",
    photos: [
      "/images/community/joanneputri-1.jpg",
      "/images/community/joanneputri-2.jpg",
      "/images/community/joanneputri-3.jpg",
    ],
  },
];

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="#2B2926" stroke="none" />
    </svg>
  );
}

function CommunityCard({ entry, onLinkClick }: { entry: CommunityEntry; onLinkClick: (e: React.MouseEvent) => void }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasPhotos = entry.photos.length > 0;
  const multiple = entry.photos.length > 1;

  return (
    <div className="flex flex-none flex-col gap-3" style={{ flexBasis: "min(300px, 82vw)" }}>
      <div className="flex items-center gap-2">
        <PersonIcon />
        <div className="text-[13px] font-medium text-dark">{entry.username}</div>
      </div>
      <div className="relative flex items-center justify-center">
        {hasPhotos ? (
          <div
            onClick={() => setLightboxOpen(true)}
            className="relative aspect-[3/4] w-full cursor-zoom-in overflow-hidden"
          >
            <Image src={entry.photos[photoIndex]} alt={entry.username} fill sizes="300px" className="object-cover object-top" />
          </div>
        ) : (
          <div
            className="aspect-[3/4] w-full"
            style={{
              background: "repeating-linear-gradient(135deg, #EFE9E1, #EFE9E1 10px, #E7DFD3 10px, #E7DFD3 20px)",
            }}
          />
        )}
        {multiple && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIndex((i) => (i - 1 + entry.photos.length) % entry.photos.length);
              }}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIndex((i) => (i + 1) % entry.photos.length);
              }}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {entry.photos.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: i === photoIndex ? "#FFFFFF" : "rgba(255,255,255,0.45)" }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="text-sm font-medium text-dark">{entry.productName}</div>
      <Link href={entry.link} draggable={false} onClick={onLinkClick} className="text-xs font-semibold uppercase tracking-[0.05em] text-dark">
        Shop Now →
      </Link>

      {lightboxOpen && (
        <Lightbox
          images={entry.photos.map((url) => ({ url, alt: entry.username }))}
          index={photoIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setPhotoIndex}
        />
      )}
    </div>
  );
}

export default function CommunityRail() {
  const scroll = useHorizontalScroll<HTMLDivElement>();

  return (
    <div className="px-[clamp(20px,5vw,56px)] pb-[88px] pt-6">
      <div className="mb-11 flex flex-col items-center gap-0.5 text-center">
        <div className="font-display text-xl font-medium uppercase tracking-[0.14em] text-black">
          Real People, Real Style
        </div>
        <h2 className="-mt-2.5 font-script text-4xl font-normal leading-none tracking-normal text-dark lowercase">
          our community
        </h2>
      </div>
      <div className="relative">
        <div ref={scroll.ref} onScroll={scroll.onScroll} className="scroll-hide flex gap-7 overflow-x-auto scroll-smooth">
          {COMMUNITY.map((entry) => (
            <CommunityCard key={entry.username} entry={entry} onLinkClick={scroll.onLinkClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
