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
  /** Placeholder grid card — opens detail popup but marked as coming soon. */
  upcoming?: boolean;
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
  portfolioTags: ["Finance", "AI"],
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
  portfolioTags: ["SaaS", "AI"],
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
  portfolioTags: ["Ecommerce", "AI"],
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
  portfolioTags: ["SaaS", "AI"],
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

const UPCOMING_SLOT_ART: Record<number, string> = {
  1: "/assets/upcoming-slot-frame.svg",
  2: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/Frame%202.svg",
  3: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/Frame%204.svg",
  4: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/Frame%205.svg",
  12: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/Frame.png",
  13: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/Frame%201321314967.png",
  14: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/Frame%201321314914.png",
  15: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/P6r4FYRwrzoeiot6tTArrPFSQI.webp",
  16: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/kddVPtRKUV1wGirlo4ho2RIypg.webp",
  17: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/te9NzGh3Pyl3njhZBICpep3m9vc.webp",
  18: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/DGNxIehGCQSruXK14E8gJCNB6a4.webp",
  19: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/CPpp4OTltNDnEx0Q4E7PY0zRNT8.avif",
  20: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/mWI4cFrnSgDolWqxydcUnfyhaE.avif",
  21: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/qP5YVSpFq05EhrX4zhqeSIxtit4.avif",
  22: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/TIcket.png",
  23: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/jar.png",
  24: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/don%27t%20burn%20youself.gif",
};

const UPCOMING_SLOT_VIDEO: Record<number, string> = {
  5: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/mgSFjnByFieompNVtqKVZ5gRE0.mp4",
  6: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/JGAEwcjrlYlecJ5u9sucL6bfCXI%20%281%29.mp4",
  7: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/UP3Nn2hAjJmYcjYDyozMbtBA8D4.mp4",
  8: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/UaoftDpqn187UvBDpp6GsCDVFyU.mp4",
  9: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/WRfEXvj0Fy7XlCGS1DPYVnLD6OM%20%281%29.mp4",
  10: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/pDBtnxUzJmrLJ2YlDXld932Skhs.mp4",
  11: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/1425XAHPiav1RbL3397N87ens.mp4",
  25: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/9L4mIylEa79TkW75HIuwCzQxE.mp4",
};

const UPCOMING_SLOT_TITLES: Record<number, string> = {
  5: "Saltbot - Report",
  6: "Concept-FreshPrints AI",
  7: "Tonpool - Onboarding",
  8: "Tonpool - Onboarding",
  9: "Tonpool - Onboarding",
  10: "Share Your Thought",
  11: "FreshPrints - Image AI",
  13: "Piggy",
  14: "Piggy - Branding",
  15: "Saltmine - 1",
  16: "Saltmine - 2",
  17: "Saltmine - 3",
  18: "Saltmine - 4",
  19: "Kalash - Rewards",
  20: "Kalash - Rewards",
  21: "Kalash - Rewards",
  22: "Kalash - Rewards",
  23: "Kalash - Rewards",
  24: "Don't Burn yourself",
  25: "Tonpool - Onboarding",
};

function createUpcomingSlot(index: number): DetailItem {
  const video = UPCOMING_SLOT_VIDEO[index];
  const art = UPCOMING_SLOT_ART[index];
  const isGif = Boolean(art && /\.gif(?:$|[?#])/i.test(art));
  const tag = video || isGif ? "Motion Graphic" : "Illustration";
  const title = UPCOMING_SLOT_TITLES[index] ?? "Cisco Security - Topology";

  return {
    slug: `slot-${index}`,
    title,
    description: tag,
    seoDescription: video || isGif
      ? `${title} — motion graphic.`
      : `${title} — illustration.`,
    ogAccent: "#385980",
    categories: ["Design"],
    portfolioTags: [tag],
    extraTags: [tag],
    date: "July 16, 2026",
    author: "Rene Wang",
    authorHandle: "renedotwang",
    editorNote: video || isGif
      ? `Motion graphic — ${title}.`
      : `Illustration — ${title}.`,
    upcoming: true,
    media: video
      ? { type: "video", src: video, aspectRatio: "4 / 3" }
      : art
        ? { type: "image", src: art, aspectRatio: "4 / 3" }
        : { type: "color", color: "#385980", aspectRatio: "4 / 3" },
  };
}

export const UPCOMING_SLOTS: DetailItem[] = Array.from({ length: 25 }, (_, i) =>
  createUpcomingSlot(i + 1),
);

/** Portfolio grid row — shown below the featured card on the home page. */
export const GRID_DETAILS: DetailItem[] = [
  FRESHPRINTS_DETAIL,
  KALASH_DETAIL,
  FINGUARD_DETAIL,
  SALTMINE_DETAIL,
  ...UPCOMING_SLOTS,
];

/** @deprecated Use GRID_DETAILS */
export const DETAILS: DetailItem[] = GRID_DETAILS;

export function getDetailBySlug(slug: string): DetailItem | undefined {
  const normalizedSlug =
    slug === "coming-soon" ? "saltmine" : slug === "upcoming" ? "freshprints" : slug;
  return GRID_DETAILS.find((item) => item.slug === normalizedSlug);
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
