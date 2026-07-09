import { getFreshPrintsProjectUrl, getKalashAppUrl } from "@/lib/site-url";

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
  flow?: "kalash" | "kalash-save-more" | "finguard" | "saltmine-plan" | "merch";
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
    "Interactive gold savings demo — live prices, savings flows, and a home experience engineers can plug into an existing design.",
  ogAccent: "#118D82",
  categories: ["Design", "Build"],
  portfolioTags: ["Finance"],
  projectUrl: getKalashAppUrl(),
  date: "July 8, 2026",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "Interactive Kalash savings flow — live gold prices, streak action sheet, story ring, and home launch through splash back to the app.",
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
    "Interactive fintech dashboard — transactions, spend overview, and profile flows.",
  ogAccent: "#4F46E5",
  categories: ["Build"],
  portfolioTags: ["SaaS"],
  extraTags: ["Inspired"],
  date: "July 7, 2026",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "Interactive FinGuard dashboard — nav across Overview, Operations, and Reports with searchable transactions, spending charts, refreshable findings, and profile and notification popovers.",
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

export const FRESHPRINTS_DETAIL: DetailItem = {
  slug: "freshprints",
  title: "FreshPrints - Image AI",
  description: "Ecommerce",
  seoDescription:
    "Merch customization flow — product preview, design tools, and color selection in a mobile-first builder.",
  ogAccent: "#191960",
  categories: ["Design", "Build"],
  portfolioTags: ["Ecommerce"],
  projectUrl: getFreshPrintsProjectUrl(),
  date: "July 9, 2026",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "Interactive Image AI merch flow — front/back shirt carousel, color swatches, and a bottom sheet from prompt and style through generate, preview, refine, and apply on the product.",
  media: {
    type: "color",
    color: "#F3F4F6",
    aspectRatio: "626 / 356",
    mockup: {
      aspectRatio: "393 / 852",
      flow: "merch",
    },
  },
};

/** @deprecated Use FRESHPRINTS_DETAIL */
export const UPCOMING_SLOT_DETAIL = FRESHPRINTS_DETAIL;

export const SALTMINE_DETAIL: DetailItem = {
  slug: "saltmine",
  title: "Saltmine",
  description: "SaaS",
  seoDescription:
    "Interactive workplace planning flow — plan particulars, locations, and cost goals.",
  ogAccent: "#7C3AED",
  categories: ["Build", "Design"],
  portfolioTags: ["SaaS"],
  date: "July 6, 2026",
  author: "Rene Wang",
  authorHandle: "renedotwang",
  editorNote:
    "Interactive Saltmine planning flow — plan particulars with duration slider, location scope and site picker, and cost goal with live preview.",
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
  FRESHPRINTS_DETAIL,
  KALASH_DETAIL,
  FINGUARD_DETAIL,
  SALTMINE_DETAIL,
];

/** @deprecated Use GRID_DETAILS */
export const DETAILS: DetailItem[] = GRID_DETAILS;

export function getDetailBySlug(slug: string): DetailItem | undefined {
  const normalizedSlug =
    slug === "coming-soon" ? "saltmine" : slug === "upcoming" ? "freshprints" : slug;
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
