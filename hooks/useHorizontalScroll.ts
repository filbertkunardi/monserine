"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useHorizontalScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const dragState = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setShowPrev(el.scrollLeft > 1);
    setShowNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    dragState.current = { active: true, moved: false, startX: e.pageX, startScroll: el.scrollLeft };
    setIsDragging(true);
  }, []);

  const onDragMove = useCallback((e: React.MouseEvent) => {
    const ds = dragState.current;
    const el = ref.current;
    if (!ds.active || !el) return;
    e.preventDefault();
    const dx = e.pageX - ds.startX;
    if (Math.abs(dx) > 3) ds.moved = true;
    el.scrollLeft = ds.startScroll - dx;
  }, []);

  const onDragEnd = useCallback(() => {
    if (dragState.current.active) {
      dragState.current.active = false;
      setIsDragging(false);
      updateScrollState();
    }
  }, [updateScrollState]);

  const onLinkClick = useCallback((e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      dragState.current.moved = false;
    }
  }, []);

  const scrollPrev = useCallback(() => {
    ref.current?.scrollBy({ left: -ref.current.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  const scrollNext = useCallback(() => {
    ref.current?.scrollBy({ left: ref.current.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  return {
    ref,
    onScroll: updateScrollState,
    onDragStart,
    onDragMove,
    onDragEnd,
    onLinkClick,
    scrollPrev,
    scrollNext,
    showPrev,
    showNext,
    dragCursor: isDragging ? "cursor-grabbing" : "cursor-grab",
  };
}
