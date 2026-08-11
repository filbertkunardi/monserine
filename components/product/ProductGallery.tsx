"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Lightbox from "@/components/Lightbox";

type GalleryImage = { url: string; altText: string | null };

const SWIPE_THRESHOLD = 40;

export default function ProductGallery({
  images,
  title,
  activeImageUrl,
}: {
  images: GalleryImage[];
  title: string;
  activeImageUrl?: string | null;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dragState = useRef({ active: false, startX: 0 });
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const desktopContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeImageUrl) return;
    const index = images.findIndex((img) => img.url === activeImageUrl);
    if (index === -1) return;
    setPhotoIndex((current) => (current === index ? current : index));

    const container = desktopContainerRef.current;
    const target = imageRefs.current[index];
    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const scrollTop = container.scrollTop + (targetRect.top - containerRect.top);
      container.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImageUrl]);

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
    dragState.current = { active: true, startX: e.clientX };
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) < SWIPE_THRESHOLD || images.length < 2) {
      setLightboxIndex(photoIndex);
      return;
    }
    if (dx < 0) goNext();
    else goPrev();
  }

  function onPointerCancel() {
    dragState.current.active = false;
  }

  return (
    <>
      {/* Desktop: sticky stacked images */}
      <div
        ref={desktopContainerRef}
        className="scroll-hide sticky top-6 hidden max-h-[calc(100vh-48px)] flex-col gap-4 overflow-y-auto bg-creamPanel min-[761px]:flex"
      >
        {images.map((image, i) => (
          <img
            key={i}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            src={image.url}
            alt={image.altText ?? title}
            onClick={() => setLightboxIndex(i)}
            className="block h-auto w-full cursor-zoom-in"
          />
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
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
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

      {lightboxIndex !== null && (
        <Lightbox
          images={images.map((img) => ({ url: img.url, alt: img.altText ?? title }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
