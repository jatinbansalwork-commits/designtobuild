"use client";

import { PORTFOLIO_FILTERS } from "@/lib/portfolio-filters";

interface PortfolioFilterBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function PortfolioFilterBar({ value, onChange }: PortfolioFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {PORTFOLIO_FILTERS.map((filter) => {
        const active = value === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-tertiary/40 ${
              active
                ? "bg-text-primary text-surface"
                : "border border-border/60 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
