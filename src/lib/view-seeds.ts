/** Free-looking starting counts so cards don’t open near zero. Max seed 500. */
export const VIEW_SEEDS: Record<string, number> = {
  freshprints: 128,
  kalash: 89,
  finguard: 150,
  saltmine: 322,
  // Upcoming grid slots — varied, stable seeds under 500
  "slot-1": 47,
  "slot-2": 112,
  "slot-3": 28,
  "slot-4": 203,
  "slot-5": 58,
  "slot-6": 341,
  "slot-7": 76,
  "slot-8": 19,
  "slot-9": 164,
  "slot-10": 92,
  "slot-11": 287,
  "slot-12": 41,
  "slot-13": 155,
  "slot-14": 63,
  "slot-15": 218,
  "slot-16": 34,
  "slot-17": 401,
  "slot-18": 87,
  "slot-19": 129,
  "slot-20": 246,
  "slot-21": 52,
  "slot-22": 178,
  "slot-23": 96,
  "slot-24": 311,
  "slot-25": 67,
  "slot-26": 43,
};

export const VIEW_SLUG_ALIASES: Record<string, string> = {
  upcoming: "freshprints",
};

/** Canonical project slugs that own a view counter (aliases excluded). */
export const VIEW_PROJECT_SLUGS = Object.keys(VIEW_SEEDS);

export function resolveViewSlug(slug: string) {
  return VIEW_SLUG_ALIASES[slug] ?? slug;
}

export function seedViewsFor(slug: string) {
  return VIEW_SEEDS[resolveViewSlug(slug)] ?? 0;
}

export function totalSeedViews() {
  return VIEW_PROJECT_SLUGS.reduce((sum, slug) => sum + VIEW_SEEDS[slug], 0);
}

/** +100 views awarded at each India-midnight boundary since this IST calendar day. */
export const DAILY_SEED_PER_NIGHT = 100;
export const DAILY_SEED_START_IST = "2026-07-20";

/** Calendar YYYY-MM-DD in Asia/Kolkata. */
export function indiaCalendarDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Nightly India seed: +100 for every completed IST day since DAILY_SEED_START_IST.
 * On the start day the bonus is 0; after the first IST midnight it becomes 100, then 200, …
 */
export function dailySeedBonus(now = new Date()) {
  const todayIst = indiaCalendarDate(now);
  const startMs = Date.parse(`${DAILY_SEED_START_IST}T00:00:00+05:30`);
  const todayMs = Date.parse(`${todayIst}T00:00:00+05:30`);
  if (!Number.isFinite(startMs) || !Number.isFinite(todayMs)) return 0;
  const days = Math.floor((todayMs - startMs) / 86_400_000);
  return Math.max(0, days) * DAILY_SEED_PER_NIGHT;
}

/** Static project seeds + India nightly growth. */
export function baselineSeedViews(now = new Date()) {
  return totalSeedViews() + dailySeedBonus(now);
}
