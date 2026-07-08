import { getKalashAppUrl } from "@/lib/site-url";

export type DetailCategory =
  | "Design"
  | "Build"
  | "Accessibility"
  | "Optimization"
  | "Copywriting"
  | "Motion";

export type DetailMockup = {
  aspectRatio: string;
  imageSrc?: string;
  flow?: "kalash" | "kalash-save-more" | "finguard";
};

export type DetailCanvasFrame = {
  width: number;
  height: number;
  src?: string;
  flow?: "saltmine-plan";
};

export type DetailMedia =
  | { type: "video"; src: string; aspectRatio: string }
  | { type: "image"; src: string; aspectRatio: string }
  | {
      type: "color";
      color: string;
      aspectRatio: string;
      mockup?: DetailMockup;
      canvasFrame?: DetailCanvasFrame;
    };

export interface DetailItem {
  slug: string;
  title: string;
  description?: string;
  categories: DetailCategory[];
  portfolioTags?: string[];
  /** Free-form descriptive chips shown alongside categories in the detail meta */
  extraTags?: string[];
  source?: string;
  sourceUrl?: string;
  /** External project / prototype link shown on the title */
  projectUrl?: string;
  date: string;
  author: string;
  authorHandle: string;
  editorNote?: string;
  media: DetailMedia;
}

export const KALASH_DETAIL: DetailItem = {
  slug: "kalash",
  title: "Kalash",
  description: "Finance",
  categories: ["Design"],
  portfolioTags: ["Finance"],
  extraTags: ["Build"],
  projectUrl: getKalashAppUrl(),
  date: "June 28, 2026",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "Portfolio preview renders the live Kalash home screen — spacing, typography, and market prices stay synced with the prototype instead of a static screenshot.",
  media: {
    type: "color",
    color: "#F1F8F7",
    aspectRatio: "626 / 356",
    mockup: {
      aspectRatio: "393 / 852",
      imageSrc: "/kalash-app-screen.png",
      flow: "kalash",
    },
  },
};

export const FINGUARD_DETAIL: DetailItem = {
  slug: "finguard",
  title: "FinGuard",
  description: "Finance",
  categories: ["Build"],
  portfolioTags: ["Finance"],
  extraTags: ["Inspired"],
  date: "July 7, 2026",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "FinGuard SaaS dashboard replica inside an interactive iPad mockup — desktop layout with transaction history, spending charts, and profile completion states.",
  media: {
    type: "color",
    color: "#F3F4F6",
    aspectRatio: "424 / 396",
    mockup: {
      aspectRatio: "16 / 10",
      flow: "finguard",
    },
  },
};

/** @deprecated Use FINGUARD_DETAIL */
export const SALTMINE_DETAIL = FINGUARD_DETAIL;

/** @deprecated Use FINGUARD_DETAIL */
export const KALASH_BUY_GOLD_DETAIL = FINGUARD_DETAIL;

export const COMING_SOON_DETAIL: DetailItem = {
  slug: "coming-soon",
  title: "Saltmine",
  description: "Finance",
  categories: ["Build"],
  portfolioTags: ["Finance"],
  date: "Coming soon",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "Saltmine workforce planning — Plan Particulars step with duration controls, step navigation, and isometric location preview inside the portfolio mockup frame.",
  media: {
    type: "color",
    color: "#F3F4F6",
    aspectRatio: "920 / 710",
    canvasFrame: { width: 828, height: 639, flow: "saltmine-plan" },
  },
};

/** Portfolio grid row — shown below the featured card on the home page. */
export const GRID_DETAILS: DetailItem[] = [
  KALASH_DETAIL,
  FINGUARD_DETAIL,
  COMING_SOON_DETAIL,
];

/** @deprecated Use GRID_DETAILS */
export const DETAILS: DetailItem[] = GRID_DETAILS;

export function getDetailBySlug(slug: string): DetailItem | undefined {
  const normalizedSlug = slug === "saltmine" ? "finguard" : slug;
  if (normalizedSlug === KALASH_DETAIL.slug) return KALASH_DETAIL;
  return GRID_DETAILS.find((detail) => detail.slug === normalizedSlug);
}

export function getCategoryIcon(category: DetailCategory): string {
  const icons: Record<DetailCategory, string> = {
    Design: "◫",
    Build: "◧",
    Accessibility: "✦",
    Optimization: "⚡",
    Copywriting: "✎",
    Motion: "◎",
  };
  return icons[category];
}
