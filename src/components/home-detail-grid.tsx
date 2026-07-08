"use client";

import { useMemo, useState } from "react";
import { getGridProjects } from "@/lib/design-of-the-day";
import { DetailCard } from "@/components/detail-card";
import { PortfolioFilterBar } from "@/components/portfolio-filter-bar";

export function HomeDetailGrid() {
  const [filter, setFilter] = useState("All");
  const gridProjects = useMemo(() => getGridProjects(), []);

  const filtered = useMemo(() => {
    if (filter === "All") return gridProjects;
    return gridProjects.filter((detail) => detail.portfolioTags?.includes(filter));
  }, [filter, gridProjects]);

  return (
    <>
      <PortfolioFilterBar value={filter} onChange={setFilter} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((detail) => (
          <DetailCard
            key={detail.slug}
            detail={detail}
            uniformHeight
            activeFilter={filter}
            onFilterSelect={setFilter}
          />
        ))}
      </div>
    </>
  );
}
