"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.loop = true;

    const tryPlay = () => {
      const p = v.play();
      if (p && p.then) {
        p.then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
      }
    };
    tryPlay();
    v.addEventListener("loadedmetadata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      v.removeEventListener("loadedmetadata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  function handleTap() {
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => setNeedsTap(false))
      .catch(() => {});
  }

  return (
    <div className="relative flex min-h-[clamp(420px,60vw,640px)] items-end overflow-hidden bg-creamPanel">
      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/[0.18]" />
      {needsTap && (
        <button
          onClick={handleTap}
          aria-label="Play video"
          className="absolute inset-0 z-[5] flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#2B2926">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
      <div className="relative flex max-w-[520px] flex-col gap-3.5 p-[clamp(28px,6vw,56px)]">
        <div className="flex flex-col gap-0.5">
          <Image
            src="/images/logo-secondary.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 object-contain object-left brightness-0"
          />
          <h1 className="m-0 font-display text-[clamp(34px,7vw,64px)] font-normal leading-[0.98] tracking-[0.01em] text-black">
            HOUSE OF MONSERINE
          </h1>
          <p className="m-0 mt-1 max-w-[400px] text-[15px] font-light leading-[1.7] text-black/90">
            Feminine silhouettes for the modern muse.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/shop"
            className="bg-button px-8 py-[15px] text-xs font-medium uppercase tracking-[0.08em] text-cream"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
