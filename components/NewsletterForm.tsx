"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done";

export default function NewsletterForm({ width = 280 }: { width?: number }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { result?: string; error?: string };

      if (!res.ok) {
        setMessage(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setMessage(data.result === "already_subscribed" ? "You're already subscribed!" : "Thanks for subscribing!");
      setStatus("done");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="text-[13px] font-light text-dark" style={{ width }}>
        {message}
      </div>
    );
  }

  return (
    <div style={{ width }}>
      <form onSubmit={handleSubmit} className="flex gap-0 border-b border-black/20 pb-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === "loading"}
          className="flex-1 border-none bg-transparent font-sans text-[13px] font-light text-dark outline-none placeholder:text-body"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-shrink-0 text-xs font-semibold uppercase tracking-[0.06em] text-dark disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {message && <div className="mt-1.5 text-xs font-light text-body">{message}</div>}
    </div>
  );
}
