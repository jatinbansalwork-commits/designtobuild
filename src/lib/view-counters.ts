import {
  dailySeedBonus,
  resolveViewSlug,
  seedViewsFor,
  totalSeedViews,
  VIEW_PROJECT_SLUGS,
} from "@/lib/view-seeds";

export const COUNTER_NAMESPACE = "designtobuild-portfolio";
export const COUNTER_BASE = `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}`;

type CounterPayload = {
  count?: number;
  message?: string;
};

function parseCount(data: CounterPayload | null) {
  if (!data || typeof data.count !== "number" || Number.isNaN(data.count)) {
    return null;
  }
  return Math.max(0, Math.floor(data.count));
}

export async function getCounter(slug: string) {
  const counterSlug = resolveViewSlug(slug);
  const res = await fetch(`${COUNTER_BASE}/${encodeURIComponent(counterSlug)}/`, {
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return 0;
  if (!res.ok) throw new Error(`counter get failed: ${res.status}`);
  return parseCount((await res.json()) as CounterPayload) ?? 0;
}

export async function incrementCounter(slug: string) {
  const counterSlug = resolveViewSlug(slug);
  const res = await fetch(`${COUNTER_BASE}/${encodeURIComponent(counterSlug)}/up`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`counter up failed: ${res.status}`);
  return parseCount((await res.json()) as CounterPayload) ?? (await getCounter(slug));
}

export function displayViews(slug: string, rawCount: number) {
  return seedViewsFor(slug) + rawCount;
}

/**
 * Seed (per-project) + India nightly growth (+100 each IST midnight) + live CounterAPI.
 */
export async function getTotalCreativeViews() {
  const projectSeed = totalSeedViews();
  const daily = dailySeedBonus();

  const results = await Promise.allSettled(
    VIEW_PROJECT_SLUGS.map(async (slug) => {
      const raw = await getCounter(slug);
      return displayViews(slug, raw);
    }),
  );

  let projectViews = 0;
  let live = 0;
  let failed = 0;

  results.forEach((result, index) => {
    const slug = VIEW_PROJECT_SLUGS[index];
    if (result.status === "fulfilled") {
      projectViews += result.value;
      live += result.value - seedViewsFor(slug);
    } else {
      failed += 1;
      projectViews += seedViewsFor(slug);
    }
  });

  return {
    views: projectViews + daily,
    seed: projectSeed,
    daily,
    live: Math.max(0, live),
    projects: VIEW_PROJECT_SLUGS.length,
    failed,
  };
}
