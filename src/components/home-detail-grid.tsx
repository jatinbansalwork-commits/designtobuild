"use client";

import { useMemo } from "react";
import { GRID_DETAILS } from "@/lib/details-data";
import { GridShotCard } from "@/components/grid-shot-card";
import { PortfolioFilterBar } from "@/components/portfolio-filter-bar";
import { usePortfolioFilter } from "@/components/portfolio-filter-context";

export function HomeDetailGrid() {
  const portfolioFilter = usePortfolioFilter();
  const filter = portfolioFilter?.filter ?? "All";
  const setFilter = portfolioFilter?.setFilter ?? (() => {});

  const filtered = useMemo(() => {
    if (filter === "All") return GRID_DETAILS;
    return GRID_DETAILS.filter((detail) => detail.portfolioTags?.includes(filter));
  }, [filter]);

  return (
    <>
      <PortfolioFilterBar value={filter} onChange={setFilter} />

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((detail) => (
          <GridShotCard key={detail.slug} detail={detail} />
        ))}
      </div>
    </>
  );
}
