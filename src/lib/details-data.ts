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
  flow?: "kalash" | "kalash-save-more" | "finguard" | "saltmine-plan";
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
  /** Short category/tag label used in UI filters (e.g. Finance, SaaS). */
  description?: string;
  /** Longer copy for social share previews and meta description. */
  seoDescription: string;
  /** Accent used on generated Open Graph / Twitter cards. */
  ogAccent: string;
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
  seoDescription:
    "Interactive gold savings app — live prices, streaks, and a phone-frame prototype you can explore.",
  ogAccent: "#118D82",
  categories: ["Design", "Build"],
  portfolioTags: ["Finance"],
  projectUrl: getKalashAppUrl(),
  date: "July 8, 2026",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "Interactive Kalash home in a phone frame — live prices, savings, and home UI stay synced with the prototype.",
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
  description: "SaaS",
  seoDescription:
    "Interactive fintech dashboard — transactions, spend overview, and profile flows in a live iPad mockup.",
  ogAccent: "#4F46E5",
  categories: ["Build"],
  portfolioTags: ["SaaS"],
  extraTags: ["Inspired"],
  date: "July 7, 2026",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "Interactive FinGuard dashboard in an iPad frame — transactions, spend charts, and profile states stay synced with the prototype.",
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
export const KALASH_BUY_GOLD_DETAIL = FINGUARD_DETAIL;

export const SALTMINE_DETAIL: DetailItem = {
  slug: "saltmine",
  title: "Saltmine",
  description: "SaaS",
  seoDescription:
    "Interactive workplace planning flow — plan particulars, locations, and cost goals in a live iPad mockup.",
  ogAccent: "#7C3AED",
  categories: ["Build", "Design"],
  portfolioTags: ["SaaS"],
  date: "July 6, 2026",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "Interactive Plan Particulars — duration, locations, and live preview in an iPad frame.",
  media: {
    type: "color",
    color: "#F3F4F6",
    aspectRatio: "424 / 396",
    mockup: {
      aspectRatio: "16 / 10",
      flow: "saltmine-plan",
    },
  },
};

/** @deprecated Use SALTMINE_DETAIL */
export const COMING_SOON_DETAIL = SALTMINE_DETAIL;

/** Portfolio grid row — shown below the featured card on the home page. */
export const GRID_DETAILS: DetailItem[] = [
  KALASH_DETAIL,
  FINGUARD_DETAIL,
  SALTMINE_DETAIL,
];

/** @deprecated Use GRID_DETAILS */
export const DETAILS: DetailItem[] = GRID_DETAILS;

export function getDetailBySlug(slug: string): DetailItem | undefined {
  const normalizedSlug = slug === "coming-soon" ? "saltmine" : slug;
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
