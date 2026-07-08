"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RetroAnimatedText } from "@/kalash/components/RetroAnimatedText";
import type { FlashbackStory } from "@/kalash/lib/flashback-stories";
import { useReducedMotion } from "@/kalash/hooks/use-reduced-motion";

interface StoryViewContentProps {
  story: FlashbackStory;
}

function StoryGreeting({
  text,
  fontSize = 32,
  lineHeight = 48,
}: {
  text: string;
  fontSize?: number;
  lineHeight?: number;
}) {
  const lines = text.split("\n");
  const isMultiLine = lines.length > 1;

  return (
    <p
      className={`w-full text-center font-sans font-bold tracking-tight text-[#01656B]${isMultiLine ? " leading-none" : ""}`}
      style={
        isMultiLine
          ? { fontSize }
          : { fontSize, lineHeight: `${lineHeight}px` }
      }
    >
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={isMultiLine ? "block" : undefined}
          style={isMultiLine ? { fontSize, lineHeight: 1 } : undefined}
        >
          {line}
        </span>
      ))}
    </p>
  );
}

function StorySubtitle({
  text,
  className = "mt-[42px]",
}: {
  text: string;
  className?: string;
}) {
  const lines = text.split("\n");

  return (
    <p
      className={`text-center font-sans text-base leading-6 text-[#212B36] ${className}`}
    >
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </p>
  );
}

/** Single flashback story frame — isolated from timer index elsewhere. */
export function StoryViewContent({ story }: StoryViewContentProps) {
  const reducedMotion = useReducedMotion();
  const isBelowTimerLayout = story.layout === "below-timer";

  return (
    <motion.div
      key={story.id}
      className={`flex w-full flex-col items-center ${isBelowTimerLayout ? "justify-start" : "justify-center"}`}
      aria-label={`Flashback story: ${story.id}`}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { type: "spring", damping: 28, stiffness: 320 }
      }
    >
      <div className="flex w-full flex-col items-center">
        <StoryGreeting
          text={story.greeting}
          fontSize={story.greetingFontSize}
          lineHeight={story.greetingLineHeight}
        />
        {!story.hero ? (
          <StorySubtitle
            text={story.subtitle}
            className="mt-0"
          />
        ) : null}
      </div>

      <div
        className={`flex w-full flex-col items-center ${isBelowTimerLayout ? "" : "justify-center"}`}
      >
        {story.subtitleAboveHero ? (
          <StorySubtitle text={story.subtitleAboveHero} className="mt-0" />
        ) : null}
        {story.hero ? (
          story.hero.kind === "retro-text" ? (
            <RetroAnimatedText text={story.hero.text} />
          ) : (
            <p className="py-6 text-center font-sans text-[72px] font-black leading-none tracking-tight text-[#01656B]">
              {story.hero.text}
            </p>
          )
        ) : null}
        {story.hero ? (
          <StorySubtitle
            text={story.subtitle}
            className="mt-[42px]"
          />
        ) : null}
        {story.image ? (
          <Image
            src={story.image.src}
            alt={story.image.alt}
            width={story.image.fullWidth ? 390 : 280}
            height={story.image.fullWidth ? 490 : 280}
            unoptimized
            className={
              story.image.className ??
              (story.image.fullWidth
                ? "-mx-6 h-auto w-[calc(100%+3rem)] max-w-none object-contain"
                : "mt-8 h-auto w-full max-w-[280px] object-contain")
            }
          />
        ) : null}
      </div>
    </motion.div>
  );
}
