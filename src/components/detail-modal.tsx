"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Undo2, X } from "lucide-react";
import type { DetailItem } from "@/lib/details-data";
import { DetailPanel } from "@/components/detail-panel";
import { ShareDetailButton } from "@/components/share-detail-button";

interface DetailModalProps {
  detail: DetailItem;
  /** Direct /detail/... visit — close goes home instead of history.back */
  standalone?: boolean;
}

export function DetailModal({ detail, standalone = false }: DetailModalProps) {
  const router = useRouter();

  const close = useCallback(() => {
    if (standalone) {
      router.replace("/");
      return;
    }
    router.back();
  }, [router, standalone]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  return (
    <>
      <div
        role="presentation"
        onClick={close}
        className="detail-modal-backdrop fixed inset-0 z-[99] hidden bg-black/60 backdrop-blur-sm md:block"
      />

      <button
        type="button"
        onClick={close}
        className="fixed top-4 left-4 z-[101] inline-flex items-center gap-2 py-1 text-base font-medium text-text-secondary transition-colors hover:text-text-primary md:text-white/75 md:hover:text-white"
      >
        <Undo2 className="h-5 w-5 shrink-0" aria-hidden />
        <span>Details</span>
      </button>

      <div className="pointer-events-none fixed top-4 right-4 z-[101] flex items-center gap-2">
        <ShareDetailButton
          slug={detail.slug}
          title={detail.title}
          size="lg"
          className="pointer-events-auto"
        />
        <button
          type="button"
          onClick={close}
          className="pointer-events-auto cursor-pointer rounded-full border border-border bg-surface-secondary/90 p-2.5 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <article
        className="fixed inset-0 z-[100] border-x-0 border-border bg-surface-secondary sm:border-0 md:inset-auto md:top-1/2 md:left-1/2 md:max-h-[min(90vh,1440px)] md:w-[calc(100%-2rem)] md:max-w-[67.2rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-none md:border md:shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${detail.title} preview`}
      >
        <div className="detail-modal-panel flex h-full max-h-[inherit] flex-col overflow-y-auto">
          <DetailPanel detail={detail} preview />
        </div>
      </article>
    </>
  );
}
