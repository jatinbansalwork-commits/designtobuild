export const VIEWS_CHANGED_EVENT = "dtb:views-changed";

type ViewsChangedDetail = {
  slug?: string;
  /** When true, the sidebar total can optimistically add 1 before refetch. */
  counted?: boolean;
};

/** Broadcast so the homepage total can refresh after a design is opened. */
export function notifyViewsChanged(detail: ViewsChangedDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VIEWS_CHANGED_EVENT, { detail }));
}
