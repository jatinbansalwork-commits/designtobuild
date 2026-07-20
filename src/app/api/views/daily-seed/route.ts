import { NextResponse } from "next/server";
import {
  DAILY_SEED_PER_NIGHT,
  DAILY_SEED_START_IST,
  dailySeedBonus,
  indiaCalendarDate,
} from "@/lib/view-seeds";

export const runtime = "nodejs";

/**
 * Nightly India seed checkpoint. Vercel Cron hits this after IST midnight so
 * the daily +100 rule is exercised in production logs. The bonus itself is
 * computed deterministically from Asia/Kolkata calendar days.
 */
export async function GET() {
  const todayIst = indiaCalendarDate();
  const daily = dailySeedBonus();

  return NextResponse.json({
    ok: true,
    timezone: "Asia/Kolkata",
    todayIst,
    startIst: DAILY_SEED_START_IST,
    perNight: DAILY_SEED_PER_NIGHT,
    daily,
  });
}
