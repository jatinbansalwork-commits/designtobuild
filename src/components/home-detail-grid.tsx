"use client";

import { useMemo } from "react";
import { GRID_DETAILS } from "@/lib/details-data";
import {
  GridShotCard,
  type EditorialCardLayout,
} from "@/components/grid-shot-card";
import { usePortfolioFilter } from "@/components/portfolio-filter-context";

/**
 * A justified-grid rhythm inspired by Variant's "squishy" rows. Cards are
 * chunked into bands of two or three that each sum to exactly 12 desktop
 * columns (6 on tablet). Band sizes are computed from the visible card count
 * so no card is ever stranded alone on a row, whatever filter is active.
 */
const TWO_CARD_PATTERNS: [number, number][] = [
  [8, 4],
  [4, 8],
  [7, 5],
  [5, 7],
];
const TWO_CARD_TABLET_PATTERNS: [number, number][] = [
  [4, 2],
  [2, 4],
];
const THREE_CARD_PATTERNS: [number, number, number][] = [
  [3, 4, 5],
  [5, 3, 4],
  [4, 5, 3],
];
const BAND_ROW_SPANS = [6, 4, 5, 4, 5];
const BAND_SIZE_CYCLE = [2, 3, 3];

function computeBandSizes(count: number): number[] {
  const sizes: number[] = [];
  let remaining = count;
  let cycleIndex = 0;

  while (remaining > 0) {
    let size = Math.min(BAND_SIZE_CYCLE[cycleIndex % BAND_SIZE_CYCLE.length], remaining);
    cycleIndex++;
    // Never leave a single card for the final band.
    if (remaining - size === 1) size = size === 3 ? 2 : Math.min(3, remaining);
    sizes.push(size);
    remaining -= size;
  }
  return sizes;
}

function computeLayouts(count: number): EditorialCardLayout[] {
  const layouts: EditorialCardLayout[] = [];
  let twoCardBands = 0;
  let threeCardBands = 0;

  computeBandSizes(count).forEach((size, bandIndex) => {
    const rows = BAND_ROW_SPANS[bandIndex % BAND_ROW_SPANS.length];

    if (size === 3) {
      const columns = THREE_CARD_PATTERNS[threeCardBands % THREE_CARD_PATTERNS.length];
      threeCardBands++;
      for (const cols of columns) {
        layouts.push({ columns: cols, rows, tabletColumns: 2, tabletRows: rows });
      }
    } else if (size === 2) {
      const columns = TWO_CARD_PATTERNS[twoCardBands % TWO_CARD_PATTERNS.length];
      const tabletColumns =
        TWO_CARD_TABLET_PATTERNS[twoCardBands % TWO_CARD_TABLET_PATTERNS.length];
      twoCardBands++;
      columns.forEach((cols, i) => {
        layouts.push({ columns: cols, rows, tabletColumns: tabletColumns[i], tabletRows: rows });
      });
    } else {
      // Only possible when a filter matches exactly one project.
      layouts.push({ columns: 12, rows, tabletColumns: 6, tabletRows: rows });
    }
  });

  return layouts;
}

export function HomeDetailGrid() {
  const portfolioFilter = usePortfolioFilter();
  const filter = portfolioFilter?.filter ?? "All";

  const filtered = useMemo(() => {
    if (filter === "All") return GRID_DETAILS;
    return GRID_DETAILS.filter((detail) => detail.portfolioTags?.includes(filter));
  }, [filter]);

  const layouts = useMemo(() => computeLayouts(filtered.length), [filtered.length]);

  return (
    <div className="variant-project-grid" aria-live="polite">
      {filtered.map((detail, index) => (
        <GridShotCard
          key={detail.slug}
          detail={detail}
          layout={layouts[index]}
          priority={index < 2}
        />
      ))}
    </div>
  );
}
