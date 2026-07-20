export const CURSOR_ALIAS = "JB";
export const CURSOR_DEFAULT_NAME = "I'm here";

/** One slot gets a one-time shutter rewind when it first enters view. */
export const SHUTTER_GLITCH_SLUG = "slot-26";

export const BUILD_HANDSHAKE_SLUGS = ["kalash", "freshprints", "finguard"] as const;
export type BuildHandshakeSlug = (typeof BUILD_HANDSHAKE_SLUGS)[number];

export const HANDSHAKE_GLYPHS: Record<BuildHandshakeSlug, string> = {
  kalash: "◆",
  freshprints: "◇",
  finguard: "◈",
};

const HANDSHAKE_KEY = "dtb-handshake-builds";
const HANDSHAKE_TOAST_KEY = "dtb-handshake-toast";
const NIGHT_WINK_KEY = "dtb-night-wink";
const GLITCH_KEY = "dtb-shutter-glitch";

export const EASTER_TOAST_EVENT = "dtb:easter-toast";
export const HANDSHAKE_CHANGED_EVENT = "dtb:handshake-changed";

export function isBuildHandshakeSlug(slug: string): slug is BuildHandshakeSlug {
  return (BUILD_HANDSHAKE_SLUGS as readonly string[]).includes(slug);
}

export function readHandshakeSet(): Set<BuildHandshakeSlug> {
  try {
    const raw = localStorage.getItem(HANDSHAKE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(
      parsed.filter((slug): slug is BuildHandshakeSlug => isBuildHandshakeSlug(slug)),
    );
  } catch {
    return new Set();
  }
}

export function markHandshake(slug: string): {
  collected: Set<BuildHandshakeSlug>;
  newlyComplete: boolean;
} {
  const collected = readHandshakeSet();
  if (!isBuildHandshakeSlug(slug)) {
    return { collected, newlyComplete: false };
  }

  const before = collected.size;
  collected.add(slug);
  try {
    localStorage.setItem(HANDSHAKE_KEY, JSON.stringify([...collected]));
  } catch {
    // ignore quota / private mode
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(HANDSHAKE_CHANGED_EVENT, { detail: { slug, collected: [...collected] } }),
    );
  }

  const complete = collected.size === BUILD_HANDSHAKE_SLUGS.length;
  let newlyComplete = false;
  if (complete && before < BUILD_HANDSHAKE_SLUGS.length) {
    try {
      if (localStorage.getItem(HANDSHAKE_TOAST_KEY) !== "1") {
        localStorage.setItem(HANDSHAKE_TOAST_KEY, "1");
        newlyComplete = true;
      }
    } catch {
      newlyComplete = true;
    }
  }

  return { collected, newlyComplete };
}

export function hasShownNightWink(istDate: string) {
  try {
    return localStorage.getItem(NIGHT_WINK_KEY) === istDate;
  } catch {
    return false;
  }
}

export function markNightWinkShown(istDate: string) {
  try {
    localStorage.setItem(NIGHT_WINK_KEY, istDate);
  } catch {
    // ignore
  }
}

export function hasPlayedShutterGlitch() {
  try {
    return sessionStorage.getItem(GLITCH_KEY) === "1";
  } catch {
    return false;
  }
}

export function markShutterGlitchPlayed() {
  try {
    sessionStorage.setItem(GLITCH_KEY, "1");
  } catch {
    // ignore
  }
}

export function showEasterToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EASTER_TOAST_EVENT, { detail: { message } }));
}

/** Classic Konami sequence, case-insensitive for b/a. */
export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;
