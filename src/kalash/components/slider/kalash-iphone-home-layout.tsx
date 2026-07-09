"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { KalashAppScreen } from "@/kalash/components/slider/kalash-app-screen";
import {
  SaveMoreScreen,
  SAVE_SCREEN_DEFAULT_AMOUNT,
} from "@/kalash/components/save-more-screen";
import {
  KalashScreenPresence,
  KalashScreenTransition,
} from "@/kalash/components/kalash-screen-transition";
import { IphoneHomeIndicator } from "@/kalash/components/slider/iphone-home-indicator";
import {
  KalashMobilePrototypeShell,
  IPHONE_SCREEN_RADIUS_PX,
} from "@/kalash/components/slider/kalash-mobile-prototype-shell";
import { FOCUS_RING, TARGET_HIT_AREA } from "@/kalash/lib/a11y";
import { useClickSound } from "@/kalash/hooks/use-click-sound";
import { getKalashDevScreen, type KalashDevScreen } from "@/kalash/lib/kalash-dev";
import type { KalashTransitionKind } from "@/kalash/lib/kalash-motion";

type KalashPhoneScreen = KalashDevScreen | "save-more";

const SPLASH_DURATION_MS = 2000;
const SCREEN_RADIUS = `${IPHONE_SCREEN_RADIUS_PX}px`;

const KALASH_ICON_HOTSPOT = {
  top: "33.2%",
  left: "75.6%",
  width: "17.9%",
  height: "9.5%",
} as const;

export function KalashIphoneHomeLayout() {
  const [screen, setScreen] = useState<KalashPhoneScreen>(
    () => getKalashDevScreen() ?? "home",
  );
  const [direction, setDirection] = useState(1);
  const [transitionKind, setTransitionKind] = useState<KalashTransitionKind>(() =>
    getKalashDevScreen() ? "fade" : "fade",
  );
  const [saveInitialAmount, setSaveInitialAmount] = useState(
    SAVE_SCREEN_DEFAULT_AMOUNT,
  );
  const playClick = useClickSound();

  const navigate = useCallback(
    (next: KalashPhoneScreen, nextDirection: number, kind: KalashTransitionKind) => {
      setDirection(nextDirection);
      setTransitionKind(kind);
      setScreen(next);
    },
    [],
  );

  const goHome = useCallback(() => {
    playClick();
    navigate("home", -1, "fade");
  }, [navigate, playClick]);

  const openKalash = useCallback(() => {
    playClick();
    navigate("splash", 1, "launch");
  }, [navigate, playClick]);

  const openSaveMore = useCallback(
    (amount = SAVE_SCREEN_DEFAULT_AMOUNT) => {
      playClick();
      setSaveInitialAmount(amount);
      navigate("save-more", 1, "push");
    },
    [navigate, playClick],
  );

  const backToApp = useCallback(() => {
    playClick();
    navigate("app", -1, "push");
  }, [navigate, playClick]);

  useEffect(() => {
    if (screen !== "splash") return;

    const timer = window.setTimeout(() => {
      navigate("app", 1, "fade");
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [navigate, screen]);

  return (
    <div
      className="relative h-full w-full min-h-0 overflow-hidden isolate"
      data-cursor-surface={
        screen === "home" || screen === "splash" ? "dark" : "light"
      }
    >
      <KalashScreenPresence>
        {screen === "home" ? (
          <KalashScreenTransition
            screenKey="home"
            direction={direction}
            kind={transitionKind}
            className="absolute inset-0 h-full w-full overflow-hidden bg-black"
          >
            <KalashMobilePrototypeShell mode="immersive">
              <Image
                src="/assets/slide-8-kalash-home.png"
                alt="iPhone home screen showing the Kalash app icon"
                width={804}
                height={1748}
                className="h-full w-full max-w-full object-cover object-top"
                style={{ borderRadius: SCREEN_RADIUS }}
                priority
              />
              <button
                type="button"
                aria-label="Open Kalash"
                className={`absolute z-10 rounded-2xl transition-colors hover:bg-white/10 focus-visible:bg-white/10 ${TARGET_HIT_AREA} ${FOCUS_RING}`}
                style={KALASH_ICON_HOTSPOT}
                onClick={openKalash}
              />
            </KalashMobilePrototypeShell>
          </KalashScreenTransition>
        ) : null}

        {screen === "splash" ? (
          <KalashScreenTransition
            screenKey="splash"
            direction={direction}
            kind={transitionKind}
            className="absolute inset-0 z-10 h-full w-full overflow-hidden bg-[#184546]"
          >
            <KalashMobilePrototypeShell mode="immersive">
              <div
                className="flex h-full w-full items-center justify-center bg-[#184546]"
                style={{ borderRadius: SCREEN_RADIUS }}
                aria-label="Kalash app splash screen"
              >
                <Image
                  src="/assets/kalash-logo-full.svg"
                  alt="Kalash"
                  width={87}
                  height={109}
                  className="h-auto w-[min(21%,80px)] max-w-full object-contain"
                  priority
                />
              </div>
            </KalashMobilePrototypeShell>
            <div className="absolute inset-x-0 bottom-0 z-[60]">
              <IphoneHomeIndicator tone="light" onPress={goHome} />
            </div>
          </KalashScreenTransition>
        ) : null}

        {screen === "app" ? (
          <KalashScreenTransition
            screenKey="app"
            direction={direction}
            kind={transitionKind}
            className="absolute inset-0 z-10 h-full w-full overflow-hidden bg-white [&_main]:!rounded-none"
          >
            <KalashMobilePrototypeShell
              mode="app"
              homeIndicator={<IphoneHomeIndicator tone="dark" onPress={goHome} />}
            >
              <KalashAppScreen onSaveMorePress={openSaveMore} />
            </KalashMobilePrototypeShell>
          </KalashScreenTransition>
        ) : null}

        {screen === "save-more" ? (
          <KalashScreenTransition
            screenKey="save-more"
            direction={direction}
            kind={transitionKind}
            className="absolute inset-0 z-10 h-full w-full overflow-hidden bg-white [&_main]:!rounded-none"
          >
            <SaveMoreScreen
              key={saveInitialAmount}
              initialAmount={saveInitialAmount}
              onBack={backToApp}
            />
            <div className="absolute inset-x-0 bottom-0 z-20">
              <IphoneHomeIndicator tone="dark" onPress={goHome} />
            </div>
          </KalashScreenTransition>
        ) : null}
      </KalashScreenPresence>
    </div>
  );
}
