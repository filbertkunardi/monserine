"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/shop");
    }
  }

  return (
    <button onClick={goBack} className="flex w-fit items-center gap-1.5 text-dark">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span>Back</span>
    </button>
  );
}
