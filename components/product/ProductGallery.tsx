"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type GalleryImage = { url: string; altText: string | null };

const SWIPE_THRESHOLD = 40;

export default function ProductGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const dragState = useRef({ active: false, startX: 0 });

  if (images.length === 0) {
    return <div className="aspect-[3/4] w-full bg-creamPanel" />;
  }

  function goPrev() {
    setPhotoIndex((i) => (i - 1 + images.length) % images.length);
  }

  function goNext() {
    setPhotoIndex((i) => (i + 1) % images.length);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (images.length < 2) return;
    dragState.current = { active: true, startX: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) goNext();
    else goPrev();
  }

  function onPointerCancel() {
    dragState.current.active = false;
  }

  return (
    <>
      {/* Desktop: sticky stacked images */}
      <div className="scroll-hide sticky top-6 hidden max-h-[calc(100vh-48px)] flex-col gap-4 overflow-y-auto bg-creamPanel min-[761px]:flex">
        {images.map((image, i) => (
          <img key={i} src={image.url} alt={image.altText ?? title} className="block h-auto w-full" />
        ))}
      </div>

      {/* Mobile: swipeable single image */}
      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{ touchAction: "pan-y" }}
        className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-creamPanel min-[761px]:hidden"
      >
        <Image
          src={images[photoIndex].url}
          alt={images[photoIndex].altText ?? title}
          fill
          sizes="100vw"
          className="pointer-events-none object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className="absolute bottom-3 right-3.5 rounded-xl bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
              {photoIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </>
  );
}
