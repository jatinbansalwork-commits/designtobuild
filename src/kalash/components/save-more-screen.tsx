"use client";

import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { BreakdownSheet } from "@/kalash/components/breakdown-sheet";
import { LivePriceBar } from "@/kalash/components/live-price-bar";
import { PriceUpdateToast } from "@/kalash/components/price-update-toast";
import { KALASH_TEAL } from "@/kalash/components/slider/kalash/kalash-tokens";
import {
  CouponCardsSkeleton,
  GramEstimateSkeleton,
} from "@/kalash/components/save-more-skeletons";
import { FOCUS_RING } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { useEdgeSwipeBack } from "@/kalash/hooks/use-edge-swipe-back";
import { useGoldPricing } from "@/kalash/hooks/use-gold-pricing";
import {
  computeGoldQuote,
  formatInr,
  GOLD_PRICING,
  type AmountUnit,
} from "@/kalash/lib/gold-pricing";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000] as const;
export const SAVE_SCREEN_DEFAULT_AMOUNT = 100;
export const SAVE_SCREEN_REWARD_AMOUNT = 1000;
const POPULAR_AMOUNT = 1000;

const TICKER_SHIELD_ICON =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/ic-solar_shield-check-bold.svg";

const HERO_SURFACE_GRADIENT =
  "linear-gradient(158deg, #F1FBF9 0%, #FFFFFF 52%, #FFFDF4 100%)";
const HERO_GOLD_GLOW =
  "radial-gradient(circle at 92% 8%, rgba(255, 209, 102, 0.28) 0%, transparent 58%)";
const CTA_GRADIENT =
  "linear-gradient(180deg, #17B5A8 0%, #118D82 48%, #0A6B64 100%)";
const COUPON_STRIP_GRADIENT =
  "linear-gradient(180deg, #FFE9A8 0%, #F2C94C 100%)";

const COUPONS = [
  {
    code: "FLASHDEAL75",
    description:
      "Get ₹75 cashback as gold rewards. Valid only once per user on a saving of ₹1,000 in gold",
    badge: "BEST VALUE",
  },
  {
    code: "GOLD10",
    description: "Get 10% extra gold on your first save above ₹2,000 this week.",
    badge: null,
  },
] as const;

interface SaveMoreScreenProps {
  onBack?: () => void;
  initialAmount?: number;
}

/** Buy Gold screen — opened from Save More CTA. */
export function SaveMoreScreen({
  onBack,
  initialAmount = SAVE_SCREEN_DEFAULT_AMOUNT,
}: SaveMoreScreenProps) {
  const router = useRouter();
  const playClick = useClickSound();
  const mainRef = useRef<HTMLElement>(null);
  const [unit, setUnit] = useState<AmountUnit>("rupees");
  const [amount, setAmount] = useState<number>(initialAmount);
  const [gramsInput, setGramsInput] = useState(
    initialAmount / GOLD_PRICING.initialPricePerGm,
  );
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const { space, color, type } = KALASH_VIEW;

  const {
    pricePerGm,
    timerSeconds,
    isPriceReady,
    areCouponsReady,
    phase,
    progressPercent,
    priceUpdateNotice,
  } = useGoldPricing();

  const quote = useMemo(
    () =>
      computeGoldQuote({
        unit,
        amountRupees: amount,
        grams: gramsInput,
        pricePerGm,
      }),
    [unit, amount, gramsInput, pricePerGm],
  );

  const rupeesToGrams = (rupees: number) => rupees / pricePerGm;
  const gramsToRupees = (grams: number) => grams * pricePerGm;

  function goBack() {
    playClick();
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  }

  useEdgeSwipeBack(mainRef, goBack);

  function selectAmount(value: number) {
    playClick();
    setAmount(value);
    setGramsInput(rupeesToGrams(value));
  }

  function switchUnit(nextUnit: AmountUnit) {
    playClick();
    if (nextUnit === "grams") {
      setGramsInput(rupeesToGrams(amount));
    } else {
      setAmount(Math.round(gramsToRupees(gramsInput)));
    }
    setUnit(nextUnit);
  }

  const canSave = phase !== "refreshing" && isPriceReady;

  return (
    <main
      ref={mainRef}
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#F7FAFB] antialiased"
      aria-label="Buy gold"
      style={{ fontFamily: type.body }}
    >
      <header
        className="relative z-20 shrink-0"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 62%, #F7FAFB 100%)",
        }}
      >
        <div style={{ paddingTop: space.safeAreaTop }}>
          <div
            className="grid grid-cols-[44px_1fr_44px] items-center py-3"
            style={{ paddingInline: space.headerGutterX - 4 }}
          >
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back"
              className={`inline-flex size-10 items-center justify-center rounded-full bg-white text-[#212B36] ring-1 ring-black/[0.06] transition-colors hover:bg-neutral-50 ${FOCUS_RING}`}
            >
              <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden />
            </button>
            <h1 className="text-center text-[17px] font-semibold tracking-[-0.2px] text-[#212B36]">
              Buy Gold
            </h1>
            <span aria-hidden />
          </div>
        </div>
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div
          style={{
            paddingInline: space.headerGutterX,
            paddingTop: 12,
            paddingBottom: 16,
          }}
        >
          {/* Unit toggle */}
          <div className="relative flex rounded-full bg-[#EDF1F3] p-1 ring-1 ring-black/[0.04]">
            {(["rupees", "grams"] as const).map((value) => {
              const selected = unit === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => switchUnit(value)}
                  aria-pressed={selected}
                  className={`relative flex-1 rounded-full px-3 py-2 text-[13px] font-semibold transition-colors duration-200 ${FOCUS_RING} ${
                    selected
                      ? "text-white"
                      : "text-[#637381] hover:text-[#212B36]"
                  }`}
                >
                  {selected ? (
                    <span
                      className="absolute inset-0 rounded-full shadow-[0_4px_12px_rgba(10,107,100,0.28)]"
                      style={{ background: CTA_GRADIENT }}
                      aria-hidden
                    />
                  ) : null}
                  <span className="relative z-10">
                    {value === "rupees" ? "In Rupees" : "In Grams"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hero amount card */}
          <div
            className="relative mt-4 overflow-hidden rounded-[24px] ring-1 ring-teal-950/[0.06] shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
            style={{ background: HERO_SURFACE_GRADIENT }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: HERO_GOLD_GLOW }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80"
              aria-hidden
            />

            <div className="relative px-5 pb-5 pt-4">
              <p className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.1em] text-[#8A94A6]">
                {unit === "rupees" ? "Enter Amount" : "Enter Weight"}
              </p>

              <div className="mt-2.5 flex items-end justify-between gap-3">
                <div className="flex min-w-0 items-baseline gap-1.5">
                  <span className="text-[30px] font-semibold leading-none text-[#212B36]">
                    ₹
                  </span>
                  {unit === "rupees" ? (
                    <span className="kalash-tabular truncate text-[40px] font-bold leading-[44px] tracking-[-1px] text-[#110E08]">
                      {formatInr(amount)}
                    </span>
                  ) : (
                    <input
                      type="number"
                      inputMode="decimal"
                      value={Number(gramsInput.toFixed(4))}
                      onChange={(event) => {
                        const next = Number.parseFloat(event.target.value);
                        if (Number.isFinite(next) && next >= 0)
                          setGramsInput(next);
                      }}
                      className="kalash-tabular w-[150px] bg-transparent text-[40px] font-bold leading-[44px] tracking-[-1px] text-[#110E08] outline-none"
                      aria-label="Amount in grams"
                    />
                  )}
                </div>

                {isPriceReady ? (
                  <span className="kalash-tabular mb-1 inline-flex shrink-0 items-center rounded-full bg-teal-50 px-2.5 py-1 text-[12px] font-bold leading-[14px] text-teal-800 ring-1 ring-teal-200/60">
                    {unit === "rupees"
                      ? `≈ ${quote.displayGrams.toFixed(4)} gm`
                      : `≈ ₹${formatInr(quote.displayRupees)}`}
                  </span>
                ) : (
                  <span className="mb-1.5">
                    <GramEstimateSkeleton />
                  </span>
                )}
              </div>

              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent" />

              <p className="kalash-tabular mt-3 flex flex-wrap items-center gap-x-1.5 text-[12px] leading-[16px] text-[#637381]">
                <span>Gold value ₹{formatInr(quote.baseAmount)}</span>
                <span className="text-neutral-300" aria-hidden>
                  •
                </span>
                <span>+ ₹{formatInr(quote.gstAmount)} (3% GST)</span>
              </p>
            </div>
          </div>

          {/* Quick amounts */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {QUICK_AMOUNTS.map((value) => {
              const selected = amount === value && unit === "rupees";

              return (
                <div key={value} className="relative pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      switchUnit("rupees");
                      selectAmount(value);
                    }}
                    className={`kalash-tabular w-full rounded-2xl border px-2 py-2.5 text-[14px] font-semibold transition-colors duration-200 ${FOCUS_RING} ${
                      selected
                        ? "border-[#118d82] bg-teal-50/70 text-[#0A6B64] shadow-[0_4px_12px_rgba(17,141,130,0.12)]"
                        : "border-neutral-200 bg-white text-[#637381] hover:border-neutral-300"
                    }`}
                  >
                    ₹{value.toLocaleString("en-IN")}
                  </button>
                  {value === POPULAR_AMOUNT ? (
                    <span
                      className="absolute -top-0.5 left-1/2 z-10 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase leading-[10px] tracking-[0.1em] text-white shadow-[0_2px_6px_rgba(10,107,100,0.35)]"
                      style={{ background: CTA_GRADIENT }}
                    >
                      Popular
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Trust bar — matches homepage MarqueeTicker strip */}
          <div
            className="relative mt-5 flex h-8 items-center justify-center gap-1.5 px-4 text-[14px] font-normal leading-[20px]"
            style={{
              marginInline: -space.headerGutterX,
              width: `calc(100% + ${space.headerGutterX * 2}px)`,
              backgroundColor: color.trustBar,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TICKER_SHIELD_ICON}
              alt=""
              className="size-3.5 shrink-0 object-contain"
              aria-hidden
            />
            <span style={{ color: color.trustBarText }}>
              <strong className="font-semibold text-[#212B36]">100%</strong> Safe
              &amp; Secure
              <span className="px-3" aria-hidden>
                |
              </span>
              <strong className="font-semibold text-[#212B36]">24K</strong> (99.9%)
              Pure Gold
            </span>
          </div>

          {/* Get extra gold */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.2px] text-[#212B36]">
              <Sparkles className="size-4 text-[#F2A93B]" aria-hidden />
              Get Extra Gold
            </h2>
            <button
              type="button"
              className={`inline-flex items-center gap-0.5 rounded-full px-1 text-[13px] font-semibold text-[#637381] transition-colors hover:text-[#212B36] ${FOCUS_RING}`}
              onClick={playClick}
            >
              Add Manually
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>

          <div className="mt-3 flex gap-3">
            {areCouponsReady ? (
              <div className="save-async-enter flex w-full gap-3">
                {COUPONS.map((coupon) => (
                  <article
                    key={coupon.code}
                    className="relative flex min-w-0 flex-1 overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                  >
                    <div
                      className="flex w-9 shrink-0 items-center justify-center"
                      style={{ background: COUPON_STRIP_GRADIENT }}
                      aria-hidden
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B4D00]"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        Coupon
                      </span>
                    </div>
                    <div className="relative min-w-0 flex-1 p-3.5 pr-4">
                      <span
                        className="pointer-events-none absolute inset-y-2 left-0 border-l border-dashed border-neutral-300"
                        aria-hidden
                      />
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[14px] font-extrabold tracking-[0.02em] text-[#212B36]">
                          {coupon.code}
                        </p>
                        <button
                          type="button"
                          className={`shrink-0 text-[13px] font-bold ${FOCUS_RING}`}
                          style={{ color: KALASH_TEAL }}
                          onClick={playClick}
                        >
                          Apply
                        </button>
                      </div>
                      <p className="mt-2 text-[11px] leading-[16px] text-[#919eab]">
                        {coupon.description}
                      </p>
                      {coupon.badge ? (
                        <span className="mt-3 inline-block rounded-md bg-[#212B36] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                          {coupon.badge}
                        </span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <CouponCardsSkeleton />
            )}
          </div>
        </div>
      </div>

      <div className="relative shrink-0">
        <PriceUpdateToast notice={priceUpdateNotice} />
        <LivePriceBar
          phase={phase}
          pricePerGm={pricePerGm}
          timerSeconds={timerSeconds}
          progressPercent={progressPercent}
        />
      </div>

      <footer
        className="shrink-0 border-t border-neutral-200/70 bg-white"
        style={{
          paddingInline: space.headerGutterX,
          paddingTop: 12,
          paddingBottom: space.safeAreaBottom,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex shrink-0 flex-col">
            <p className="kalash-tabular text-[28px] font-bold leading-[32px] tracking-[-0.5px] text-[#110E08]">
              ₹{formatInr(quote.displayRupees)}
            </p>
            <p className="mt-0.5 text-[12px] font-medium text-[#919eab]">
              Incl. (GST)
            </p>
            <button
              type="button"
              className={`mt-0.5 inline-flex w-fit items-center gap-0.5 text-[12px] font-semibold ${FOCUS_RING}`}
              style={{ color: KALASH_TEAL }}
              onClick={() => {
                playClick();
                setBreakdownOpen(true);
              }}
            >
              View Breakdown
              <ChevronDown className="size-3.5" aria-hidden />
            </button>
          </div>

          <button
            type="button"
            onClick={playClick}
            disabled={!canSave}
            className={`save-now-shimmer group relative flex h-14 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full text-[16px] font-bold leading-[22px] text-white ring-1 ring-[#0A6B64]/25 transition-[opacity,transform] duration-200 active:scale-[0.99] ${FOCUS_RING} ${
              canSave ? "" : "cursor-not-allowed opacity-60"
            }`}
            style={{ background: CTA_GRADIENT }}
          >
            <span
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#FFE161]/55 to-transparent"
              aria-hidden
            />
            <span className="relative z-10">
              {canSave ? "Save Now" : "Updating…"}
            </span>
            {canSave ? (
              <ArrowRight
                className="relative z-10 size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2.5}
                aria-hidden
              />
            ) : null}
          </button>
        </div>
      </footer>

      <BreakdownSheet
        open={breakdownOpen}
        onClose={() => setBreakdownOpen(false)}
        quote={quote}
        timerSeconds={timerSeconds}
        phase={phase}
      />
    </main>
  );
}
