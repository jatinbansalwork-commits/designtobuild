import { NextResponse } from "next/server";
import { getTotalCreativeViews } from "@/lib/view-counters";

export const runtime = "nodejs";

/** Aggregate seed + live views across every creative. */
export async function GET() {
  try {
    const total = await getTotalCreativeViews();
    return NextResponse.json(total, {
      headers: {
        // Keep totals fresh so homepage / design opens stay in sync.
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to load total views" }, { status: 503 });
  }
}
