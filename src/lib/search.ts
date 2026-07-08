import type { DetailItem } from "@/lib/details-data";

export const FILTER_CATEGORIES = [
  "Typography",
  "Copywriting",
  "Motion",
  "Optimization",
  "Accessibility",
  "Design",
  "Interactivity",
  "Easter Egg",
] as const;

export type FilterCategory = (typeof FILTER_CATEGORIES)[number];
export type SortOrder = "latest" | "oldest" | "random";

export function filterDetails(
  details: DetailItem[],
  query: string,
  categoryFilters: string[],
): DetailItem[] {
  const normalized = query.trim().toLowerCase();

  return details.filter((item) => {
    if (categoryFilters.length > 0) {
      const matchesCategory = categoryFilters.some((filter) =>
        item.categories.some((category) => category.toLowerCase() === filter.toLowerCase()),
      );
      if (!matchesCategory) return false;
    }

    if (!normalized) return true;

    return (
      item.title.toLowerCase().includes(normalized) ||
      item.description?.toLowerCase().includes(normalized) ||
      item.categories.some((category) => category.toLowerCase().includes(normalized)) ||
      item.source?.toLowerCase().includes(normalized)
    );
  });
}

export function sortDetails(details: DetailItem[], sort: SortOrder): DetailItem[] {
  if (sort === "oldest") return [...details].reverse();
  if (sort === "random") return [...details].sort(() => Math.random() - 0.5);
  return details;
}

export function getSuggestions(details: DetailItem[], query: string, limit = 6): DetailItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return details
    .filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.description?.toLowerCase().includes(normalized),
    )
    .slice(0, limit);
}

export function parseTypesParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);
}

export function buildTypesParam(categoryFilters: string[]): string | null {
  if (categoryFilters.length === 0) return null;
  return categoryFilters.map((category) => category.toLowerCase()).join(",");
}
