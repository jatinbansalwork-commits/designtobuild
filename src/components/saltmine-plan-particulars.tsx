"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, FileText, Minus, Plus } from "lucide-react";

export const SALTMINE_PLAN_WIDTH = 828;
export const SALTMINE_PLAN_HEIGHT = 639;

const SALTMINE_PLAN_ILLUSTRATION_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/salt.svg";

const STEPS = [
  { id: "setup", label: "Plan setup" },
  { id: "location", label: "Location" },
  { id: "business", label: "Business line" },
  { id: "goal", label: "Goal" },
  { id: "review", label: "Review" },
] as const;

const MONTH_MARKS = [1, 2, 3, 4, 5, 6, 9, 12] as const;

function formatMonths(months: number) {
  return months === 1 ? "1 month" : `${months} months`;
}

interface SaltminePlanParticularsProps {
  onContinue?: (payload: { planName: string; durationLabel: string }) => void;
}

/** Saltmine — Plan Particulars step (modern replica). */
export function SaltminePlanParticulars({
  onContinue,
}: SaltminePlanParticularsProps = {}) {
  const [planName, setPlanName] = useState("Strategy 2024");
  const [durationIndex, setDurationIndex] = useState(2);
  const [sliderActive, setSliderActive] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  const CURRENT_STEP = 0;
  const durationMonths = MONTH_MARKS[durationIndex];
  const sliderPercent =
    MONTH_MARKS.length > 1
      ? (durationIndex / (MONTH_MARKS.length - 1)) * 100
      : 0;
  const nameValid = planName.trim().length > 0;
  const showNameError = nameTouched && !nameValid;
  const canContinue = nameValid;
  const durationLabel = formatMonths(durationMonths);

  const shiftDuration = (delta: number) => {
    setDurationIndex((current) =>
      Math.min(MONTH_MARKS.length - 1, Math.max(0, current + delta)),
    );
  };

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden bg-[#FAFAFA] text-[#111]"
      style={{
        fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif",
      }}
    >
      <header className="shrink-0 px-8 pb-0 pt-4">
        <div className="flex items-center justify-between gap-4 pb-4">
          <p className="text-[12px] font-medium text-[#6B7280]">
            Step {CURRENT_STEP + 1} of {STEPS.length}
          </p>
          <p className="text-[12px] font-medium text-[#9CA3AF]">
            {STEPS[CURRENT_STEP].label}
          </p>
        </div>
        <div className="relative h-px bg-[#ECEEF2]">
          <div
            className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 gap-1.5"
            role="progressbar"
            aria-valuenow={CURRENT_STEP + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-label="Plan creation progress"
          >
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= CURRENT_STEP ? "bg-[#6366F1]" : "bg-[#E5E7EB]"
                }`}
                title={step.label}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,46fr)_minmax(0,54fr)] gap-6 px-8 py-5">
        <div className="flex min-h-0 min-w-0 flex-col border-r border-[#ECEEF2] pr-6">
          <h1 className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#111]">
            Name & duration
          </h1>

          <label className="mt-5 block">
            <span className="text-[12px] font-medium text-[#6B7280]">Plan name</span>
            <div className="relative mt-2">
              <FileText
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]"
                strokeWidth={2}
                aria-hidden
              />
              <input
                type="text"
                value={planName}
                onChange={(event) => setPlanName(event.target.value)}
                onBlur={() => setNameTouched(true)}
                className={`w-full rounded-xl border-0 bg-white py-3.5 pl-10 pr-4 text-[15px] font-medium text-[#111] outline-none ring-1 transition-[box-shadow,ring-color] focus:bg-white ${
                  showNameError
                    ? "ring-[#FCA5A5] focus:ring-[#EF4444]"
                    : "ring-[#E5E7EB] focus:ring-[#A5B4FC]"
                }`}
                aria-invalid={showNameError}
                aria-describedby={showNameError ? "plan-name-error" : undefined}
              />
            </div>
            {showNameError ? (
              <p id="plan-name-error" className="mt-2 text-[12px] font-medium text-[#DC2626]">
                Enter a plan name.
              </p>
            ) : null}
          </label>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-medium text-[#6B7280]">Duration</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => shiftDuration(-1)}
                  disabled={durationIndex === 0}
                  aria-label="Decrease duration"
                  className="flex size-7 items-center justify-center rounded-lg text-[#6B7280] ring-1 ring-[#E5E7EB] transition-colors hover:bg-white hover:text-[#111] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="size-3.5" strokeWidth={2.5} />
                </button>
                <span className="min-w-[5.5rem] rounded-full bg-[#EEF2FF] px-3 py-1 text-center text-[12px] font-semibold text-[#4F46E5]">
                  {formatMonths(durationMonths)}
                </span>
                <button
                  type="button"
                  onClick={() => shiftDuration(1)}
                  disabled={durationIndex === MONTH_MARKS.length - 1}
                  aria-label="Increase duration"
                  className="flex size-7 items-center justify-center rounded-lg text-[#6B7280] ring-1 ring-[#E5E7EB] transition-colors hover:bg-white hover:text-[#111] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="size-3.5" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="relative mt-4">
              <div
                className={`pointer-events-none absolute -top-9 z-10 -translate-x-1/2 rounded-lg bg-[#111] px-2.5 py-1 text-[12px] font-semibold text-white shadow-md transition-opacity duration-150 ${
                  sliderActive ? "opacity-100" : "opacity-0"
                }`}
                style={{ left: `${sliderPercent}%` }}
              >
                {formatMonths(durationMonths)}
                <span
                  className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-[#111]"
                  aria-hidden
                />
              </div>

              <div className="relative h-6">
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#E5E7EB]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[#6366F1] transition-[width] duration-200"
                    style={{ width: `${sliderPercent}%` }}
                  />
                </div>
                {MONTH_MARKS.map((mark, index) => {
                  const left =
                    MONTH_MARKS.length > 1
                      ? (index / (MONTH_MARKS.length - 1)) * 100
                      : 0;
                  return (
                    <span
                      key={`tick-${mark}`}
                      aria-hidden
                      className={`absolute top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 ${
                        index <= durationIndex ? "bg-[#6366F1]" : "bg-[#D1D5DB]"
                      }`}
                      style={{ left: `${left}%` }}
                    />
                  );
                })}
              </div>

              <input
                type="range"
                min={0}
                max={MONTH_MARKS.length - 1}
                step={1}
                value={durationIndex}
                onChange={(event) => setDurationIndex(Number(event.target.value))}
                onPointerDown={() => setSliderActive(true)}
                onPointerUp={() => setSliderActive(false)}
                onPointerLeave={() => setSliderActive(false)}
                onBlur={() => setSliderActive(false)}
                className={`saltmine-plan-slider absolute inset-x-0 top-0 h-6 w-full cursor-pointer appearance-none bg-transparent ${
                  sliderActive ? "saltmine-plan-slider--active" : ""
                }`}
                aria-label="Plan duration in months"
                aria-valuetext={formatMonths(durationMonths)}
              />

              <div className="relative mt-4 h-5">
                {MONTH_MARKS.map((mark, index) => {
                  const left =
                    MONTH_MARKS.length > 1
                      ? (index / (MONTH_MARKS.length - 1)) * 100
                      : 0;
                  const active = index === durationIndex;
                  const isFirst = index === 0;
                  const isLast = index === MONTH_MARKS.length - 1;
                  return (
                    <button
                      key={mark}
                      type="button"
                      onClick={() => setDurationIndex(index)}
                      className={`absolute text-[12px] font-medium leading-none transition-colors ${
                        isFirst
                          ? "left-0"
                          : isLast
                            ? "right-0"
                            : "-translate-x-1/2"
                      } ${
                        active ? "text-[#4F46E5]" : "text-[#9CA3AF] hover:text-[#6B7280]"
                      }`}
                      aria-label={`Set duration to ${formatMonths(mark)}`}
                      style={!isFirst && !isLast ? { left: `${left}%` } : undefined}
                    >
                      {mark}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-auto rounded-xl bg-white px-4 py-3 ring-1 ring-[#E5E7EB]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#111]">
                  {planName.trim() || "Untitled plan"}
                </p>
                <p className="mt-1 truncate text-[12px] text-[#6B7280]">
                  {formatMonths(durationMonths)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-0 min-w-0 overflow-hidden rounded-2xl bg-[#F5F3FF]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-[-6%]">
              <Image
                src={SALTMINE_PLAN_ILLUSTRATION_SRC}
                alt="Isometric preview of office locations in your plan"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          <div className="absolute inset-x-0 -bottom-px z-20 rounded-b-2xl bg-white/95 px-5 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-semibold text-[#111]">
                {formatMonths(durationMonths)}
              </p>
              <div className="h-1 w-24 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="h-full rounded-full bg-[#6366F1] transition-[width] duration-300 ease-out"
                  style={{ width: `${sliderPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="sticky bottom-0 z-20 flex min-h-[64px] shrink-0 items-center justify-between gap-3 border-t border-[#ECEEF2] bg-[#FAFAFA] px-8 py-3">
        <button
          type="button"
          className="rounded-lg px-3 py-2 text-[13px] font-medium text-[#6B7280] transition-colors hover:bg-white hover:text-[#111]"
        >
          Save draft
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl px-5 py-2.5 text-[14px] font-semibold text-[#D1D5DB] ring-1 ring-[#E5E7EB]"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => {
              if (!canContinue) {
                setNameTouched(true);
                return;
              }
              onContinue?.({
                planName: planName.trim() || "Untitled plan",
                durationLabel,
              });
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(99,102,241,0.28)] transition-all duration-200 hover:bg-[#4F46E5] hover:shadow-[0_8px_20px_rgba(99,102,241,0.32)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#C7D2FE] disabled:shadow-none"
          >
            Continue
            <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </footer>
    </div>
  );
}
