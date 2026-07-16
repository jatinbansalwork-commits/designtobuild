/**
 * Fixed popup media canvas — matches FreshPrints Image AI (16:9).
 * All detail popup media areas use this so height/width stay consistent.
 *
 * Blank letterbox / pillarbox space uses a solid fallback color
 * (`#385980` for upcoming slots, black otherwise) — no auto color sampling.
 */
export const DETAIL_POPUP_MEDIA_ASPECT = "16 / 9";

/** Tailwind classes for the popup media frame (rounded top on desktop). */
export const DETAIL_POPUP_MEDIA_CLASS =
  "aspect-video w-full shrink-0 overflow-hidden md:rounded-t-xl";
