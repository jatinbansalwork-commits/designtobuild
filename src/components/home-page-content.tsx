"use client";

import Image from "next/image";
import { EasterEggToastHost } from "@/components/easter-egg-toast";
import { HomeDetailGrid } from "@/components/home-detail-grid";
import { KonamiSurprise } from "@/components/konami-surprise";
import { PortfolioFilterBar } from "@/components/portfolio-filter-bar";
import {
  PortfolioFilterProvider,
  usePortfolioFilter,
} from "@/components/portfolio-filter-context";
import { TotalCreativeViews } from "@/components/total-creative-views";
import UserCursor from "@/components/user-cursor";
import { playShutterTick } from "@/lib/shutter-tick";

function CuratorCredit() {
  return (
    <div className="flex items-center">
      <Image
        src="/jb-avatar.png"
        alt="Jatin Bansal"
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 rounded-full"
      />
      <div className="flex items-center gap-1.5 px-2 text-sm text-text-secondary">
        <span>Curated by JB</span>
      </div>
    </div>
  );
}

function PortfolioHome() {
  const portfolioFilter = usePortfolioFilter();
  const filter = portfolioFilter?.filter ?? "All";
  const setFilter = portfolioFilter?.setFilter ?? (() => {});

  return (
    <>
      <UserCursor />
      <KonamiSurprise />
      <EasterEggToastHost />

      <main className="relative z-10 min-h-[100dvh] lg:grid lg:h-[100dvh] lg:grid-cols-[20rem_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[24rem_minmax(0,1fr)]">
        <aside className="relative z-20 flex min-h-[24rem] flex-col justify-between border-b border-border/60 bg-surface/90 px-5 py-6 backdrop-blur-xl sm:px-8 sm:py-8 lg:h-[100dvh] lg:min-h-0 lg:border-r lg:border-b-0">
          <div>
            <div className="mb-14 flex items-center justify-between lg:mb-24">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
                JB / Selected work
              </span>
              <span className="size-2 bg-[#02BCEA]" aria-hidden />
            </div>

            <h1 className="font-hero max-w-[17rem] text-[clamp(2.5rem,5vw,4.8rem)] font-medium leading-[0.94] tracking-[-0.055em] text-text-primary lg:text-[3.8rem]">
              Design
              <br />
              <span className="text-text-tertiary">&amp; build.</span>
            </h1>

            <p className="mt-6 max-w-[20rem] text-sm leading-6 text-text-secondary">
              Curiosity and creativity have always been central to my life. When I&apos;m not tinkering at work, I love exploring, learning, trying new things and diving into new hobbies. Here are just a few of the things I&apos;ve made.
            </p>

            <TotalCreativeViews className="mt-4" />

            <div className="mt-7">
              <CuratorCredit />
            </div>
          </div>

          <div className="mt-12 lg:mt-8">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
              Filter the archive
            </p>
            <PortfolioFilterBar value={filter} onChange={setFilter} align="start" />

            <div className="mt-8 hidden items-center justify-between border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary lg:flex">
              <span>Scroll to explore</span>
              <span aria-hidden>↓</span>
            </div>
          </div>
        </aside>

        <section
          className="variant-gallery-scroll relative min-h-screen bg-surface px-2 py-2 sm:px-3 sm:py-3 lg:h-[100dvh] lg:min-h-0 lg:overflow-y-auto"
          onClick={(event) => {
            const target = event.target as Element | null;
            if (!target) return;
            if (target.closest(".variant-project-card")) return;
            if (target.closest("button, a, input, select, textarea")) return;
            playShutterTick();
          }}
        >
          <HomeDetailGrid />
        </section>
      </main>
    </>
  );
}

export function HomePageContent() {
  return (
    <PortfolioFilterProvider>
      <PortfolioHome />
    </PortfolioFilterProvider>
  );
}
