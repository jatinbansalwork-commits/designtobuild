"use client";

import Image from "next/image";
import { BackgroundParticles } from "@/components/background-particles";
import { DetailCard } from "@/components/detail-card";
import { HomeDetailGrid } from "@/components/home-detail-grid";
import { PortfolioFilterProvider } from "@/components/portfolio-filter-context";
import UserCursor from "@/components/user-cursor";
import { getDesignOfTheDay } from "@/lib/design-of-the-day";

function CuratorCredit() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/jb-avatar.png"
        alt="Jatin Bansal"
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 rounded-full"
      />
      <div className="flex items-center gap-1.5 px-2 text-base text-text-secondary">
        <span>Curated by JB</span>
      </div>
    </div>
  );
}

export function HomePageContent() {
  return (
    <PortfolioFilterProvider>
      <UserCursor />
      <BackgroundParticles fullScreen />
      <div className="relative z-10">
        <section
          data-home-hero
          className="relative overflow-hidden py-20 text-text-primary"
        >
          <div className="relative z-10 mt-24 flex flex-col items-center justify-center gap-6">
            <div className="flex w-full flex-col items-center justify-center gap-4 px-4 text-center sm:px-0">
              <h1 className="font-hero px-4 text-3xl font-medium leading-tight sm:px-0 sm:text-5xl">
                Design & build
              </h1>
            </div>
            <CuratorCredit />
          </div>

          <div className="relative z-10 mt-8 w-full px-4 sm:px-0">
            <DetailCard detail={getDesignOfTheDay()} featured />
          </div>
        </section>

        <section className="relative z-10 mt-8 px-4 pb-16 sm:px-0">
          <HomeDetailGrid />
        </section>
      </div>
    </PortfolioFilterProvider>
  );
}
