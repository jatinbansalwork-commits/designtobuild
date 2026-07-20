"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import { ArrowUpRight, MousePointer2, Play } from "lucide-react";
import type { DetailItem } from "@/lib/details-data";
import { ClipPathReveal } from "@/components/clip-path-reveal";
import { DetailMediaPreview } from "@/components/detail-media-preview";
import {
  HANDSHAKE_CHANGED_EVENT,
  HANDSHAKE_GLYPHS,
  isBuildHandshakeSlug,
  markHandshake,
  readHandshakeSet,
  showEasterToast,
  type BuildHandshakeSlug,
} from "@/lib/easter-eggs";

export type EditorialCardLayout = {
  columns: number;
  rows: number;
  tabletColumns?: number;
  tabletRows?: number;
};

export function GridShotCard({
  detail,
  layout,
  priority = false,
}: {
  detail: DetailItem;
  layout: EditorialCardLayout;
  priority?: boolean;
}) {
  const router = useRouter();
  const href = `/detail/${detail.slug}`;
  const isVideo = detail.media.type === "video";
  const isInteractive = detail.categories.includes("Build");
  const isHandshakeBuild = isBuildHandshakeSlug(detail.slug);
  const [handshakeCollected, setHandshakeCollected] = useState(false);

  useEffect(() => {
    if (!isHandshakeBuild) return;
    const sync = () => {
      setHandshakeCollected(readHandshakeSet().has(detail.slug as BuildHandshakeSlug));
    };
    sync();
    window.addEventListener(HANDSHAKE_CHANGED_EVENT, sync);
    return () => window.removeEventListener(HANDSHAKE_CHANGED_EVENT, sync);
  }, [detail.slug, isHandshakeBuild]);

  const style = {
    "--card-cols": layout.columns,
    "--card-rows": layout.rows,
    "--card-tablet-cols": layout.tabletColumns ?? Math.min(layout.columns, 6),
    "--card-tablet-rows": layout.tabletRows ?? layout.rows,
  } as CSSProperties;

  function isEmbeddedControl(target: EventTarget | null) {
    return (
      target instanceof Element &&
      Boolean(
        target.closest(
          "button, a, input, select, textarea, [role='button'], [role='slider'], [contenteditable='true']",
        ),
      )
    );
  }

  function collectHandshake() {
    if (!isHandshakeBuild) return;
    const { newlyComplete } = markHandshake(detail.slug);
    if (newlyComplete) {
      showEasterToast("Build handshake complete");
    }
  }

  function openProject(event: MouseEvent<HTMLElement>) {
    if (isEmbeddedControl(event.target)) {
      // Interacting inside a live Build mockup still counts toward the handshake.
      collectHandshake();
      return;
    }
    collectHandshake();
    router.push(href);
  }

  function openProjectFromKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    collectHandshake();
    router.push(href);
  }

  return (
    <article
      role="link"
      tabIndex={0}
      data-project-slug={detail.slug}
      aria-label={`${detail.title} — ${detail.description ?? "project"}`}
      onClick={openProject}
      onKeyDown={openProjectFromKeyboard}
      onMouseEnter={() => router.prefetch(href)}
      className="variant-project-card group relative block min-h-0 cursor-pointer overflow-hidden rounded-lg border border-white/[0.08] bg-surface-secondary text-inherit shadow-[0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_18px_45px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02BCEA]"
      style={style}
    >
      <div className="variant-project-media relative h-full w-full overflow-hidden">
        {isVideo || isInteractive ? (
          <span
            className="pointer-events-none absolute top-3 right-3 z-30 inline-flex size-8 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:scale-105"
            aria-label={isVideo ? "Video" : "Interactive project"}
            title={isVideo ? "Video" : "Interactive project"}
          >
            {isVideo ? (
              <Play className="size-3.5 fill-current" aria-hidden />
            ) : (
              <MousePointer2 className="size-3.5" aria-hidden />
            )}
          </span>
        ) : null}

        {isHandshakeBuild && handshakeCollected ? (
          <span
            className="pointer-events-none absolute top-3 left-3 z-30 inline-flex size-7 items-center justify-center rounded-full border border-[#02BCEA]/40 bg-black/55 font-mono text-[12px] text-[#02BCEA] shadow-sm backdrop-blur-md"
            aria-hidden
            title="Build handshake"
          >
            {HANDSHAKE_GLYPHS[detail.slug as BuildHandshakeSlug]}
          </span>
        ) : null}

        <ClipPathReveal colorKey={detail.slug} className="h-full w-full">
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]">
            <DetailMediaPreview
              media={detail.media}
              title={detail.title}
              cover
              fill
              priority={priority}
            />
          </div>
        </ClipPathReveal>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-4 pt-16 pb-4">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium tracking-[-0.01em] text-white">
                {detail.title}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
                {detail.description ?? detail.portfolioTags?.[0] ?? "Project"}
              </p>
            </div>
            <ArrowUpRight
              className="size-4 shrink-0 translate-y-1 text-white/55 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </article>
  );
}
