"use client";

import { useMemo } from "react";
import { getGridProjects } from "@/lib/design-of-the-day";
import { GridShotCard } from "@/components/grid-shot-card";
import { PortfolioFilterBar } from "@/components/portfolio-filter-bar";
import { usePortfolioFilter } from "@/components/portfolio-filter-context";

export function HomeDetailGrid() {
  const portfolioFilter = usePortfolioFilter();
  const filter = portfolioFilter?.filter ?? "All";
  const setFilter = portfolioFilter?.setFilter ?? (() => {});
  const gridProjects = useMemo(() => getGridProjects(), []);

  const filtered = useMemo(() => {
    if (filter === "All") return gridProjects;
    return gridProjects.filter((detail) => detail.portfolioTags?.includes(filter));
  }, [filter, gridProjects]);

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
