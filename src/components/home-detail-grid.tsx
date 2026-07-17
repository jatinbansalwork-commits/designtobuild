"use client";

import { useMemo } from "react";
import { GRID_DETAILS } from "@/lib/details-data";
import {
  GridShotCard,
  type EditorialCardLayout,
} from "@/components/grid-shot-card";
import { usePortfolioFilter } from "@/components/portfolio-filter-context";

/**
 * A repeating justified-grid rhythm inspired by Variant's "squishy" rows.
 * Every band must sum to exactly 12 desktop columns (6 on tablet) with equal
 * row spans, otherwise the dense grid leaves unfillable holes beside cards.
 */
const EDITORIAL_LAYOUTS: EditorialCardLayout[] = [
  // Band 1: 8 + 4
  { columns: 8, rows: 6, tabletColumns: 6, tabletRows: 5 },
  { columns: 4, rows: 6, tabletColumns: 3, tabletRows: 4 },
  // Band 2: 4 + 8
  { columns: 4, rows: 4, tabletColumns: 3, tabletRows: 4 },
  { columns: 8, rows: 4, tabletColumns: 6, tabletRows: 4 },
  // Band 3: 5 + 7
  { columns: 5, rows: 5, tabletColumns: 3, tabletRows: 4 },
  { columns: 7, rows: 5, tabletColumns: 3, tabletRows: 4 },
  // Band 4: 3 + 5 + 4
  { columns: 3, rows: 4, tabletColumns: 2, tabletRows: 4 },
  { columns: 5, rows: 4, tabletColumns: 4, tabletRows: 4 },
  { columns: 4, rows: 4, tabletColumns: 6, tabletRows: 4 },
  // Band 5: full-bleed feature break
  { columns: 12, rows: 5, tabletColumns: 6, tabletRows: 4 },
];

export function HomeDetailGrid() {
  const portfolioFilter = usePortfolioFilter();
  const filter = portfolioFilter?.filter ?? "All";

  const filtered = useMemo(() => {
    if (filter === "All") return GRID_DETAILS;
    return GRID_DETAILS.filter((detail) => detail.portfolioTags?.includes(filter));
  }, [filter]);

  return (
    <div className="variant-project-grid" aria-live="polite">
      {filtered.map((detail, index) => (
        <GridShotCard
          key={detail.slug}
          detail={detail}
          layout={EDITORIAL_LAYOUTS[index % EDITORIAL_LAYOUTS.length]}
          priority={index < 2}
        />
      ))}
    </div>
  );
}
