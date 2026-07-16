export const PORTFOLIO_FILTERS = [
  "All",
  "AI",
  "Illustration",
  "Finance",
  "Motion Graphic",
  "Ecommerce",
  "SaaS",
] as const;

export type PortfolioFilter = (typeof PORTFOLIO_FILTERS)[number];

export function isPortfolioFilter(value: string): value is PortfolioFilter {
  return PORTFOLIO_FILTERS.includes(value as PortfolioFilter);
}

export function getProjectFilterLabel(detail: {
  description?: string;
  portfolioTags?: string[];
}): PortfolioFilter | null {
  const candidates = [detail.description, ...(detail.portfolioTags ?? [])].filter(
    (value): value is string => Boolean(value),
  );

  return (
    candidates.find((value): value is PortfolioFilter => value !== "All" && isPortfolioFilter(value)) ??
    null
  );
}

