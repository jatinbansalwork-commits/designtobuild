import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const NAMESPACE = "designtobuild-portfolio";
const COUNTER_BASE = `https://api.counterapi.dev/v1/${NAMESPACE}`;
const VIEW_COOKIE_PREFIX = "dtb_view_";
const VIEW_COOKIE_MAX_AGE = 60 * 60 * 12; // 12h — feels like IG/Dribbble unique-ish views

/** Free-looking starting counts so cards don’t open near zero. */
const VIEW_SEEDS: Record<string, number> = {
  kalash: 89,
  finguard: 150,
  saltmine: 322,
};

const ALLOWED_SLUGS = new Set(Object.keys(VIEW_SEEDS));

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
  return (VIEW_SEEDS[slug] ?? 0) + rawCount;
}

async function getCounter(slug: string) {
  const res = await fetch(`${COUNTER_BASE}/${encodeURIComponent(slug)}/`, {
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return 0;
  if (!res.ok) throw new Error(`counter get failed: ${res.status}`);
  return parseCount((await res.json()) as CounterPayload) ?? 0;
}

async function incrementCounter(slug: string) {
  const res = await fetch(`${COUNTER_BASE}/${encodeURIComponent(slug)}/up`, {
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
