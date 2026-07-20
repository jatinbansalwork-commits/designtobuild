import { NextRequest, NextResponse } from "next/server";
import {
  displayViews,
  getCounter,
  incrementCounter,
} from "@/lib/view-counters";
import {
  VIEW_SEEDS,
  VIEW_SLUG_ALIASES,
} from "@/lib/view-seeds";

export const runtime = "nodejs";

const VIEW_COOKIE_PREFIX = "dtb_view_";
const VIEW_COOKIE_MAX_AGE = 60 * 60 * 12; // 12h — feels like IG/Dribbble unique-ish views

const ALLOWED_SLUGS = new Set([
  ...Object.keys(VIEW_SEEDS),
  ...Object.keys(VIEW_SLUG_ALIASES),
]);

function cookieName(slug: string) {
  return `${VIEW_COOKIE_PREFIX}${slug}`;
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
