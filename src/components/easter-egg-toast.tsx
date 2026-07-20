"use client";

import { useEffect, useState } from "react";
import { EASTER_TOAST_EVENT } from "@/lib/easter-eggs";

/** Soft floating toast for easter-egg payoffs. */
export function EasterEggToastHost() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let hideTimer: number | undefined;

    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      if (!detail?.message) return;
      setMessage(detail.message);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setMessage(null), 3200);
    };

    window.addEventListener(EASTER_TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(EASTER_TOAST_EVENT, onToast);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[10000] -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
    >
      {message}
    </div>
  );
}
