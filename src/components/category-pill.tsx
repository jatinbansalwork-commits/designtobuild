import type { DetailCategory } from "@/lib/details-data";
import { getCategoryIcon } from "@/lib/details-data";

export function CategoryPill({ category }: { category: DetailCategory }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-none border border-border bg-surface-hover px-3 py-1.5 text-xs font-medium text-text-secondary">
      <span className="text-[10px] opacity-80" aria-hidden>
        {getCategoryIcon(category)}
      </span>
      {category}
    </span>
  );
}
