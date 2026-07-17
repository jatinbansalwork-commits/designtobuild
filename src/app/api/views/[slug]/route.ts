import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const NAMESPACE = "designtobuild-portfolio";
const COUNTER_BASE = `https://api.counterapi.dev/v1/${NAMESPACE}`;
const VIEW_COOKIE_PREFIX = "dtb_view_";
const VIEW_COOKIE_MAX_AGE = 60 * 60 * 12; // 12h — feels like IG/Dribbble unique-ish views

/** Free-looking starting counts so cards don’t open near zero. Max seed 500. */
const VIEW_SEEDS: Record<string, number> = {
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

const SLUG_ALIASES: Record<string, string> = {
  upcoming: "freshprints",
};

const ALLOWED_SLUGS = new Set([
  ...Object.keys(VIEW_SEEDS),
  ...Object.keys(SLUG_ALIASES),
]);

function resolveViewSlug(slug: string) {
  return SLUG_ALIASES[slug] ?? slug;
}

type CounterPayload = {
  count?: number;
  message?: string;
};

function cookieName(slug: string) {
  return `${VIEW_COOKIE_PREFIX}${slug}`;
}

function parseCount(data: CounterPayload | null) {
  if (!data || typeof data.count !== "number" || Number.isNaN(data.count)) {
    return null;
  }
  return Math.max(0, Math.floor(data.count));
}

function displayViews(slug: string, rawCount: number) {
  return (VIEW_SEEDS[resolveViewSlug(slug)] ?? 0) + rawCount;
}

async function getCounter(slug: string) {
  const counterSlug = resolveViewSlug(slug);
  const res = await fetch(`${COUNTER_BASE}/${encodeURIComponent(counterSlug)}/`, {
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return 0;
  if (!res.ok) throw new Error(`counter get failed: ${res.status}`);
  return parseCount((await res.json()) as CounterPayload) ?? 0;
}

async function incrementCounter(slug: string) {
  const counterSlug = resolveViewSlug(slug);
  const res = await fetch(`${COUNTER_BASE}/${encodeURIComponent(counterSlug)}/up`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`counter up failed: ${res.status}`);
  return parseCount((await res.json()) as CounterPayload) ?? (await getCounter(slug));
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!ALLOWED_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Unknown project" }, { status: 404 });
  }

  try {
    const raw = await getCounter(slug);
    return NextResponse.json({ slug, views: displayViews(slug, raw) });
  } catch {
    return NextResponse.json({ error: "Unable to load views" }, { status: 503 });
  }
}

/** Record a visit (once per cookie window) and return the latest count. */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!ALLOWED_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Unknown project" }, { status: 404 });
  }

  const alreadyCounted = request.cookies.get(cookieName(slug))?.value === "1";

  try {
    const raw = alreadyCounted
      ? await getCounter(slug)
      : await incrementCounter(slug);

    const response = NextResponse.json({
      slug,
      views: displayViews(slug, raw),
      counted: !alreadyCounted,
    });

    if (!alreadyCounted) {
      response.cookies.set(cookieName(slug), "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: VIEW_COOKIE_MAX_AGE,
      });
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to record view" }, { status: 503 });
  }
}
