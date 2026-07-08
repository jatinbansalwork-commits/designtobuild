"use client";

import { ChevronRight } from "lucide-react";
import { DailySavingsCard } from "@/kalash/components/DailySavingsCard";
import { FOCUS_RING } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";
import { UI_COPY } from "@/kalash/lib/ui-copy";

const SAVINGS_ASSETS = {
  weeklyIcon:
    "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/2.svg",
  monthlyIcon: "/assets/savings/monthly-icon.svg",
} as const;

interface ExploreSavingsSectionProps {
  onSavingsPress?: () => void;
}

function CompactChevron({ className }: { className: string }) {
  const { color } = KALASH_VIEW;

  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full ring-1 backdrop-blur-sm ${className}`}
      aria-hidden
    >
      <ChevronRight
        className="size-3.5"
        style={{ color: color.text }}
        strokeWidth={2.25}
      />
    </span>
  );
}

const ROW_THEMES = {
  weekly: {
    gradient:
      "linear-gradient(90deg, #ECFDF9 0%, #FFFFFF 42%, #F4FDFB 100%)",
    glow: "radial-gradient(circle at 8% 50%, rgba(17, 141, 130, 0.18) 0%, transparent 54%)",
    chevron: "bg-white/90 ring-teal-200/30",
    ring: "ring-teal-950/[0.06]",
  },
  monthly: {
    gradient:
      "linear-gradient(90deg, #EEF3FF 0%, #FFFFFF 42%, #F6F8FF 100%)",
    glow: "radial-gradient(circle at 8% 50%, rgba(99, 102, 241, 0.18) 0%, transparent 54%)",
    chevron: "bg-white/90 ring-indigo-200/30",
    ring: "ring-indigo-950/[0.06]",
  },
} as const;

function SavingsRowCard({
  variant,
  iconSrc,
  title,
  description,
  onPress,
}: {
  variant: keyof typeof ROW_THEMES;
  iconSrc: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  const theme = ROW_THEMES[variant];
  const { color, type } = KALASH_VIEW;

  return (
    <button
      type="button"
      onClick={onPress}
      className={`group relative flex w-full min-h-[96px] items-center gap-3.5 overflow-hidden rounded-[18px] py-4 pl-4 pr-12 text-left ring-1 transition-transform duration-200 active:scale-[0.99] ${theme.ring} ${FOCUS_RING}`}
      style={{
        background: theme.gradient,
        fontFamily: type.body,
      }}
      aria-label={`${title}. ${description}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: theme.glow }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-4 top-1/2 size-24 -translate-y-1/2 opacity-[0.06]"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt=""
          width={96}
          height={96}
          className="size-full object-contain"
          draggable={false}
        />
      </div>

      <div className="relative z-10 flex size-14 shrink-0 items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt=""
          width={48}
          height={48}
          className="size-12 object-contain"
          draggable={false}
        />
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <p
          className="text-[16px] font-semibold leading-[22px] tracking-[-0.2px]"
          style={{ color: color.text, letterSpacing: type.bodyTracking }}
        >
          {title}
        </p>
        <p
          className="mt-0.5 text-[13px] font-medium leading-[18px]"
          style={{ color: color.label, letterSpacing: type.bodyTracking }}
        >
          {description}
        </p>
      </div>

      <CompactChevron
        className={`absolute right-4 top-1/2 -translate-y-1/2 ${theme.chevron}`}
      />
    </button>
  );
}

/** Explore savings — daily / weekly / monthly gold saving options. */
export function ExploreSavingsSection({
  onSavingsPress,
}: ExploreSavingsSectionProps) {
  const playClick = useClickSound();
  const { space, type } = KALASH_VIEW;
  const copy = UI_COPY.exploreSavings;

  function handlePress() {
    playClick();
    onSavingsPress?.();
  }

  return (
    <section
      aria-label="Explore savings in gold"
      style={{
        paddingInline: space.headerGutterX,
        paddingBottom: 20,
        fontFamily: type.body,
      }}
    >
      <div className="flex flex-col" style={{ gap: 20 }}>
        <DailySavingsCard onPress={handlePress} />

        <SavingsRowCard
          variant="weekly"
          iconSrc={SAVINGS_ASSETS.weeklyIcon}
          title={copy.weekly.title}
          description={copy.weekly.description}
          onPress={handlePress}
        />
      </div>
    </section>
  );
}
