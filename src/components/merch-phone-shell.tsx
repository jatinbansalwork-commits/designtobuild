"use client";

import { IphoneScreenChrome } from "@/components/iphone-screen-chrome";
import { MerchDesignPreview } from "@/components/merch-design-preview";

/** Merch phone mockup — Safari chrome includes the home-indicator inset. */
export function MerchPhoneShell({ interactive = false }: { interactive?: boolean }) {
  return (
    <IphoneScreenChrome suppressHomeIndicator>
      <MerchDesignPreview interactive={interactive} />
    </IphoneScreenChrome>
  );
}
