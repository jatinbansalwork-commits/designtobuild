"use client";

import { useCallback } from "react";

/** Click sound disabled — returns a no-op so callers stay unchanged. */
export function useClickSound() {
  return useCallback(() => {}, []);
}
