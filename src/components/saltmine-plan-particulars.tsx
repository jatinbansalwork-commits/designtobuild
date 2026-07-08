"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2, MoreHorizontal } from "lucide-react";

export const SALTMINE_PLAN_WIDTH = 828;
export const SALTMINE_PLAN_HEIGHT = 639;

const SALTMINE_PLAN_ILLUSTRATION_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/salt.svg";

const STEPS = [
  "Plan Particulars",
  "Location",
  "Business Line",
  "Goal",
  "Review",
] as const;

const MONTH_MARKS = [1, 2, 3, 4, 5, 6, 9, 12] as const;

/** Saltmine — Plan Particulars step (modern replica). */
export function SaltminePlanParticulars() {
  const [planName, setPlanName] = useState("Strategy 2024");
  const [durationMonths, setDurationMonths] = useState(3);
  const [nextHover, setNextHover] = useState(false);

  const sliderPercent =
    ((durationMonths - 1) / (MONTH_MARKS[MONTH_MARKS.length - 1] - 1)) * 100;

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden bg-white text-[#111]"
      style={{
        fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif",
      }}
    >
      {/* Step navigation */}
      <header className="flex shrink-0 items-center justify-between border-b border-[#F0F1F4] pb-0 pl-0 pr-8 pt-5">
        <nav className="flex items-center gap-6">
          {STEPS.map((step, index) => {
            const active = index === 0;
            return (
              <button
                key={step}
                type="button"
                className={`relative pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  active ? "text-[#111]" : "text-[#B8BCC6] hover:text-[#6B7280]"
                }`}
              >
                {step}
                {active ? (
                  <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]" />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 pb-3">
          <button
            type="button"
            aria-label="More options"
            className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-[#F4F5F7] hover:text-[#111]"
          >
            <MoreHorizontal className="size-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Expand"
            className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-[#F4F5F7] hover:text-[#111]"
          >
            <Maximize2 className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.05fr] gap-6 py-6 pl-0 pr-0">
        {/* Form column */}
        <div className="flex min-h-0 flex-col">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#111]">
            Plan Particulars and duration
          </h1>

          <label className="mt-6 block">
            <span className="text-[12px] font-medium text-[#9CA3AF]">Plan Name</span>
            <input
              type="text"
              value={planName}
              onChange={(event) => setPlanName(event.target.value)}
              className="mt-2 w-full rounded-xl border-0 bg-[#F7F8FA] px-4 py-3.5 text-[15px] font-medium text-[#111] outline-none ring-1 ring-transparent transition-[box-shadow,ring-color] focus:bg-white focus:ring-[#C4B5FD]"
            />
          </label>

          <div className="mt-7">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-semibold text-[#111]">Plan Duration</span>
              <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-[#B45309]">
                {durationMonths} MO
              </span>
            </div>

            <div className="relative mt-5 px-1">
              <div className="relative h-1.5 rounded-full bg-[#ECEEF2]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] transition-[width] duration-200"
                  style={{ width: `${sliderPercent}%` }}
                />
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={durationMonths}
                onChange={(event) => setDurationMonths(Number(event.target.value))}
                className="saltmine-plan-slider absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
                aria-label="Plan duration in months"
              />
              <div className="mt-3 flex justify-between text-[10px] font-medium text-[#C4C9D4]">
                {MONTH_MARKS.map((mark) => (
                  <span
                    key={mark}
                    className={durationMonths === mark ? "text-[#7C3AED]" : ""}
                  >
                    {mark}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-5 max-w-[320px] text-[12px] leading-relaxed text-[#9CA3AF]">
              For optimal results, we set the plan duration based on the last year for
              which headcount projections are provided. Please adjust as required.
            </p>
          </div>
        </div>

        {/* Illustration column */}
        <div className="relative min-h-0 overflow-hidden bg-[#F5F3FF] ring-1 ring-[#EDE9FE]">
          <Image
            src={SALTMINE_PLAN_ILLUSTRATION_SRC}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex shrink-0 justify-end border-t border-[#F0F1F4] py-4 pl-0 pr-8">
        <button
          type="button"
          onMouseEnter={() => setNextHover(true)}
          onMouseLeave={() => setNextHover(false)}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_10px_28px_rgba(99,102,241,0.35)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {nextHover ? (
            <span
              className="pointer-events-none absolute -right-1 top-1/2 size-8 -translate-y-1/2 rounded-full bg-white/25 blur-md"
              aria-hidden
            />
          ) : null}
          Next
        </button>
      </footer>
    </div>
  );
}
