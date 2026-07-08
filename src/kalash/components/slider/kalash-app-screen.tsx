"use client";

import { useCallback, useEffect, useState } from "react";
import { AppBottomNav } from "@/kalash/components/AppBottomNav";
import { AppHeaderRow } from "@/kalash/components/AppHeaderRow";
import { AssetMetricsGrid } from "@/kalash/components/AssetMetricsGrid";
import { GoldRewardCard } from "@/kalash/components/GoldRewardCard";
import { ExploreSavingsSection } from "@/kalash/components/ExploreSavingsSection";
import { FeedbackCard } from "@/kalash/components/FeedbackCard";
import { KalashActionSheet } from "@/kalash/components/KalashActionSheet";
import { StoryViewOverlay } from "@/kalash/components/StoryViewOverlay";
import { MarqueeTicker } from "@/kalash/components/MarqueeTicker";
import { PromoStrip } from "@/kalash/components/PromoStrip";
import { SaveMoreButton } from "@/kalash/components/SaveMoreButton";
import { SavingStreakCard } from "@/kalash/components/SavingStreakCard";
import { SpinsAvailableCard } from "@/kalash/components/SpinsAvailableCard";
import { TotalSavingHero } from "@/kalash/components/TotalSavingHero";
import { ViewContainer } from "@/kalash/components/ViewContainer";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";

const ACTION_SHEET_DELAY_MS = 1000;

interface KalashAppScreenProps {
  initialStoryOpen?: boolean;
  initialStoryIndex?: number;
  storyAutoAdvance?: boolean;
  disableActionSheet?: boolean;
  onSaveMorePress?: (amount?: number) => void;
}

/** Screen 3 — Kalash app home (main build target). */
export function KalashAppScreen({
  initialStoryOpen = false,
  initialStoryIndex = 0,
  storyAutoAdvance = true,
  disableActionSheet = false,
}: KalashAppScreenProps = {}) {
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(initialStoryOpen);

  // Save navigation removed — save buttons only dismiss the action sheet.
  const openSaveScreen = useCallback(() => {
    setActionSheetOpen(false);
  }, []);

  const openStory = () => {
    setActionSheetOpen(false);
    setStoryOpen(true);
  };

  useEffect(() => {
    if (disableActionSheet) return;

    const timer = window.setTimeout(() => {
      setActionSheetOpen(true);
    }, ACTION_SHEET_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [disableActionSheet]);

  const { color } = KALASH_VIEW;

  return (
    <div className="relative h-full min-h-0 w-full">
      <ViewContainer
        header={
          <>
            <AppHeaderRow onAvatarClick={openStory} />
            <PromoStrip />
          </>
        }
        bottomNav={<AppBottomNav />}
      >
        <div style={{ backgroundColor: color.surface }}>
          <TotalSavingHero />
          <AssetMetricsGrid />
          <SaveMoreButton onPress={openSaveScreen} />
          <MarqueeTicker />
        </div>
        <GoldRewardCard onSavePress={openSaveScreen} />
        <div
          className="flex flex-1 flex-col"
          style={{ backgroundColor: color.contentBg }}
        >
          <ExploreSavingsSection onSavingsPress={openSaveScreen} />
          <SpinsAvailableCard />
          <SavingStreakCard onStartSavingPress={openSaveScreen} />
          <FeedbackCard />
        </div>
      </ViewContainer>

      <StoryViewOverlay
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
        initialStoryIndex={initialStoryIndex}
        autoAdvance={storyAutoAdvance}
      />

      <KalashActionSheet
        open={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        onSaveNowPress={openSaveScreen}
      />
    </div>
  );
}
