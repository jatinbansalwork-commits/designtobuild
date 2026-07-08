import type { Metadata } from "next";
import { HomePageContent } from "@/components/home-page-content";
import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const ogImage = getAbsoluteUrl("/og/home.png");

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: "website",
    images: [
      {
        url: ogImage,
        secureUrl: ogImage,
        type: "image/png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: TWITTER_HANDLE,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [ogImage],
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
