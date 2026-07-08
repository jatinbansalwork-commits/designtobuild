"use client";

import { PORTFOLIO_FILTERS } from "@/lib/portfolio-filters";

interface PortfolioFilterBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function PortfolioFilterBar({ value, onChange }: PortfolioFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
      {PORTFOLIO_FILTERS.map((filter) => {
        const active = value === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={`text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
              active
                ? "bg-text-primary px-2.5 py-1 text-surface"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
