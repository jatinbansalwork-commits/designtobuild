"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowDownUp,
  CaseSensitive,
  Egg,
  MousePointerClick,
  Search,
  SlidersHorizontal,
  Sparkles,
  Type,
  Wind,
  X,
  Zap,
} from "lucide-react";
import type { DetailItem } from "@/lib/details-data";
import { FILTER_CATEGORIES, type SortOrder } from "@/lib/search";

interface SearchToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  categoryFilters: string[];
  onCategoryFiltersChange: (categories: string[]) => void;
  suggestions: DetailItem[];
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
}

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "latest", label: "Latest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "random", label: "Random" },
];

const CATEGORY_ICONS: Record<string, typeof Type> = {
  Typography: Type,
  Copywriting: CaseSensitive,
  Motion: Wind,
  Optimization: Zap,
  Accessibility: Sparkles,
  Design: SlidersHorizontal,
  Interactivity: MousePointerClick,
  "Easter Egg": Egg,
};

function CategoryIcon({ category }: { category: string }) {
  const Icon = CATEGORY_ICONS[category] ?? SlidersHorizontal;
  return <Icon className="h-3.5 w-3.5 opacity-80" aria-hidden />;
}

export function SearchToolbar({
  query,
  onQueryChange,
  categoryFilters,
  onCategoryFiltersChange,
  suggestions,
  sort,
  onSortChange,
}: SearchToolbarProps) {
  const [sortOpen, setSortOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const hasActiveSearch = query.trim().length > 0 || categoryFilters.length > 0;
  const showSuggestions = query.trim().length > 0 && suggestions.length > 0;
  const showCategoryPanel = query.trim().length === 0;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "f") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      event.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggleCategory(category: string) {
    if (categoryFilters.includes(category)) {
      onCategoryFiltersChange(categoryFilters.filter((value) => value !== category));
      return;
    }
    onCategoryFiltersChange([...categoryFilters, category]);
    onQueryChange("");
    inputRef.current?.focus();
  }

  function removeCategory(category: string) {
    onCategoryFiltersChange(categoryFilters.filter((value) => value !== category));
    inputRef.current?.focus();
  }

  function clearSearch() {
    onQueryChange("");
    onCategoryFiltersChange([]);
    inputRef.current?.focus();
  }

  function selectSuggestion(item: DetailItem) {
    onQueryChange(item.title);
    inputRef.current?.blur();
  }

  return (
    <div className="flex w-full flex-col gap-3 px-4 sm:flex-row sm:items-center sm:gap-3 sm:px-0">
      <div
        ref={searchRef}
        data-search-input
        className="group relative flex min-w-0 flex-1 items-center"
      >
        <div className="relative flex w-full items-center gap-1.5 rounded-none border border-border bg-surface-secondary pl-3 pr-2 transition-all focus-within:ring-2 focus-within:ring-text-primary/50">
          <label
            htmlFor="search-input"
            className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center"
          >
            <Search className="h-4 w-4 text-text-secondary" aria-hidden />
          </label>

          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-hide">
            {categoryFilters.map((category) => (
              <span
                key={category}
                className="inline-flex shrink-0 items-center gap-1 rounded-none bg-text-primary py-0.5 pl-2 pr-1 text-[11px] font-medium text-surface"
              >
                <CategoryIcon category={category} />
                <span className="whitespace-nowrap">{category}</span>
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-surface/20"
                  aria-label={`Remove ${category} filter`}
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            ))}

            <input
              ref={inputRef}
              id="search-input"
              type="text"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls={showSuggestions ? listboxId : undefined}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={categoryFilters.length > 0 ? "" : "Search"}
              className="min-w-[80px] flex-1 bg-transparent py-2 text-text-primary outline-none placeholder:text-text-secondary"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {hasActiveSearch ? (
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-full p-1 transition-colors hover:bg-surface-tertiary"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-text-secondary" aria-hidden />
              </button>
            ) : (
              <kbd className="hidden h-5 min-w-5 items-center justify-center rounded-none border border-border bg-surface-tertiary px-1.5 text-xs font-medium text-text-secondary sm:inline-flex">
                F
              </kbd>
            )}
          </div>
        </div>

        {showCategoryPanel ? (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-lg group-focus-within:block">
            <div className="max-h-[400px] overflow-y-auto p-3">
              <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                Type
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTER_CATEGORIES.map((category) => {
                  const selected = categoryFilters.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => toggleCategory(category)}
                      className={`inline-flex items-center gap-1.5 rounded-none border px-3 py-1.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-text-primary/50 ${
                        selected
                          ? "border-text-primary bg-text-primary text-surface"
                          : "border-border bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary"
                      }`}
                    >
                      <CategoryIcon category={category} />
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {showSuggestions ? (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
          >
            <div className="max-h-[400px] overflow-y-auto">
              {suggestions.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(item)}
                  className="flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-secondary"
                >
                  <span className="text-sm font-medium text-text-primary">{item.title}</span>
                  {item.description ? (
                    <span className="line-clamp-1 text-xs text-text-secondary">
                      {item.description}
                    </span>
                  ) : null}
                  <span className="text-[11px] text-text-secondary">{item.categories[0]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div ref={sortRef} className="relative ml-auto shrink-0 sm:ml-0">
        <button
          type="button"
          onClick={() => setSortOpen((open) => !open)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-none border border-border bg-surface-secondary px-5 py-3 text-sm font-medium text-text-primary transition hover:bg-surface sm:w-auto sm:py-2.5"
          aria-label="Sort"
          aria-expanded={sortOpen}
        >
          <ArrowDownUp className="h-4 w-4" aria-hidden />
          Sort
        </button>

        {sortOpen ? (
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-lg">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSortChange(option.value);
                  setSortOpen(false);
                }}
                className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-surface-secondary ${
                  sort === option.value ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
