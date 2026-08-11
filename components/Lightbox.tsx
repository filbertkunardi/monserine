"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type LightboxImage = { url: string; alt: string };

const SWIPE_THRESHOLD = 40;

export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const dragState = useRef({ active: false, startX: 0 });

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
    }
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, images.length, onClose, onIndexChange]);

  function goPrev() {
    onIndexChange((index - 1 + images.length) % images.length);
  }

  function goNext() {
    onIndexChange((index + 1) % images.length);
  }

  function onPointerDown(e: React.PointerEvent) {
    dragState.current = { active: true, startX: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) < SWIPE_THRESHOLD) {
      onClose();
      return;
    }
    if (images.length < 2) return;
    if (dx < 0) goNext();
    else goPrev();
  }

  function onPointerCancel() {
    dragState.current.active = false;
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
      >
        ×
      </button>

      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: "pan-y" }}
        className="relative h-full w-full max-w-4xl"
      >
        <Image src={images[index].url} alt={images[index].alt} fill sizes="100vw" className="object-contain" />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-black/50 px-3 py-1 text-xs text-white">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
