"use client";

import { Bebas_Neue } from "next/font/google";
import { FOCUS_RING } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

export const GOLD_REWARD_BAR_ASSET_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/Digital%20Gold.svg";

const CARD_BG_GRADIENT =
  "linear-gradient(152deg, #0a6b64 0%, #118D82 38%, #14c4b4 72%, #1adccc 100%)";
const CARD_GOLD = "#FFE161";
const CARD_GOLD_GLOW = "rgba(255, 225, 97, 0.42)";
const QUEST_LINE_COUNT = 9;
const HERO_IMAGE_HEIGHT_PX = 129;

const questDisplayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

function parseHeadline(headline: string) {
  const match = headline.match(/^(₹[\d,]+)\s+(.+)$/);
  return {
    amount: match?.[1] ?? headline,
    title: match?.[2] ?? "",
  };
}

function QuestPatternLine({ label }: { label: string }) {
  return (
    <p
      className={`${questDisplayFont.className} text-center text-[36px] uppercase leading-none tracking-[0.16em]`}
      style={{ color: "rgba(255, 255, 255, 0.16)" }}
    >
      {label}
    </p>
  );
}

function QuestPatternColumn({
  label,
  ariaHidden,
}: {
  label: string;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-3 py-1"
      aria-hidden={ariaHidden}
    >
      {Array.from({ length: QUEST_LINE_COUNT }, (_, index) => (
        <QuestPatternLine key={`${label}-${index}`} label={label} />
      ))}
    </div>
  );
}

/** Layer 2 — masked vertical GOLD QUEST scroll over gradient. */
function GoldQuestMotionLayer({
  label,
  reducedMotion,
}: {
  label: string;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="gold-reward-quest-mask pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-50"
      aria-hidden
    >
      {reducedMotion ? (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          {Array.from({ length: QUEST_LINE_COUNT }, (_, index) => (
            <QuestPatternLine key={index} label={label} />
          ))}
        </div>
      ) : (
        <div className="flex animate-gold-quest-scroll flex-col will-change-transform">
          <QuestPatternColumn label={label} />
          <QuestPatternColumn label={label} ariaHidden />
        </div>
      )}
    </div>
  );
}

interface GoldRewardCardProps {
  onSavePress?: () => void;
}

/** First-save gold reward promo — assured ₹100 reward card. */
export function GoldRewardCard({ onSavePress }: GoldRewardCardProps) {
  const playClick = useClickSound();
  const reducedMotion = useReducedMotion();
  const { color, space, type } = KALASH_VIEW;
  const copy = UI_COPY.goldReward;
  const { amount, title } = parseHeadline(copy.headline);

  function handleSave() {
    playClick();
    onSavePress?.();
  }

  return (
    <div
      style={{
        paddingTop: space.sectionY,
        paddingBottom: 20,
        paddingInline: space.headerGutterX,
        backgroundColor: color.contentBg,
      }}
    >
      <div className="relative overflow-hidden rounded-[24px] shadow-[0_18px_40px_rgba(17,141,130,0.22)] ring-1 ring-white/10">
        {/* Layer 1 — gradient base + light */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: CARD_BG_GRADIENT }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 58% at 50% -8%, rgba(255,255,255,0.28) 0%, transparent 62%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 72% 52% at 50% 108%, rgba(0,0,0,0.22) 0%, transparent 68%)",
          }}
          aria-hidden
        />

        {/* Layer 2 — GOLD QUEST motion */}
        <GoldQuestMotionLayer
          label={copy.questPattern}
          reducedMotion={reducedMotion}
        />

        {/* Layer 3 — copy, hero, CTA */}
        <div className="relative z-10 px-6 pb-8 pt-9">
          <div className="text-center">
            <span
              className="inline-flex items-center rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/95 backdrop-blur-sm"
              style={{ letterSpacing: "0.14em" }}
            >
              {copy.assured}
            </span>

            <div className="mt-4">
              <p
                className="kalash-tabular text-[40px] font-bold leading-[44px] tracking-[-0.04em]"
                style={{
                  color: CARD_GOLD,
                  textShadow: `0 2px 28px ${CARD_GOLD_GLOW}`,
                }}
              >
                {amount}
              </p>
              {title ? (
                <p
                  className="mt-1 text-[20px] font-semibold leading-[26px] text-white"
                  style={{ letterSpacing: type.displayTracking }}
                >
                  {title}
                </p>
              ) : null}
            </div>

            <p
              className="mx-auto mt-2 max-w-[272px] text-[15px] font-normal leading-[22px] text-white/88"
              style={{ letterSpacing: type.bodyTracking }}
            >
              {copy.subtitle}
            </p>
          </div>

          <div
            className="relative mx-auto my-4 flex items-center justify-center"
            style={{ height: HERO_IMAGE_HEIGHT_PX, width: 220 }}
          >
            <div
              className="gold-reward-hero-glow pointer-events-none absolute inset-0"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GOLD_REWARD_BAR_ASSET_SRC}
              alt=""
              width={220}
              height={HERO_IMAGE_HEIGHT_PX}
              className={`relative z-10 h-[129px] w-auto object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.28)] ${
                reducedMotion ? "" : "gold-reward-hero-float"
              }`}
              draggable={false}
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            className={`relative mx-auto flex h-11 w-full max-w-[300px] items-center justify-center overflow-hidden rounded-full bg-white text-[16px] font-semibold leading-[22px] text-[#0f766e] shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-transform duration-150 active:scale-[0.98] ${FOCUS_RING}`}
            style={{ letterSpacing: type.bodyTracking }}
          >
            <span className="relative z-10">{UI_COPY.cta.saveNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
