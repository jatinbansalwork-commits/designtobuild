"use client";

import { PORTFOLIO_FILTERS } from "@/lib/portfolio-filters";

interface PortfolioFilterBarProps {
  value: string;
  onChange: (value: string) => void;
  align?: "start" | "center";
}

export function PortfolioFilterBar({
  value,
  onChange,
  align = "center",
}: PortfolioFilterBarProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${
        align === "start" ? "justify-start" : "justify-center"
      }`}
    >
      {PORTFOLIO_FILTERS.map((filter) => {
        const active = value === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-tertiary/40 ${
              active
                ? "bg-text-primary text-surface shadow-sm"
                : "border border-border/70 bg-surface-secondary/40 text-text-secondary hover:-translate-y-0.5 hover:bg-surface-hover hover:text-text-primary"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
