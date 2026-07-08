"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { getDetailShareUrl } from "@/lib/site-url";

interface ShareDetailButtonProps {
  slug: string;
  title: string;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "lg";
}

export function ShareDetailButton({
  slug,
  title,
  className = "",
  showLabel = false,
  size = "sm",
}: ShareDetailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const url = getDetailShareUrl(
      slug,
      typeof window !== "undefined" ? window.location.origin : undefined,
    );

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const iconClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const buttonSizeClass = showLabel
    ? "px-3 py-1.5 text-xs font-medium"
    : size === "lg"
      ? "justify-center rounded-full p-2.5"
      : "h-8 w-8 justify-center rounded-full p-0";

  return (
    <button
      type="button"
      onClick={copyLink}
      title={copied ? "Link copied" : "Copy link"}
      aria-label={copied ? "Link copied" : `Copy link to ${title}`}
      className={`inline-flex cursor-pointer items-center gap-1.5 border border-border bg-surface-secondary/90 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary ${buttonSizeClass} ${className}`}
    >
      {copied ? (
        <Check className={`${iconClass} shrink-0 text-green-500`} aria-hidden />
      ) : showLabel ? (
        <>
          <Share2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>Share</span>
        </>
      ) : (
        <Link2 className={`${iconClass} shrink-0`} aria-hidden />
      )}
    </button>
  );
}
