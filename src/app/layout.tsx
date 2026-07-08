import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Source_Serif_4, Space_Grotesk } from "next/font/google";
import { SiteJsonLd } from "@/components/site-json-ld";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_LOCALE, SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Jatin Bansal" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "design",
  keywords: SITE_KEYWORDS,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: siteUrl,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    creator: TWITTER_HANDLE,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${ibmPlexSans.variable} ${spaceGrotesk.variable} ${sourceSerif4.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-surface text-text-primary antialiased">
        <SiteJsonLd />
        <div className="mx-auto flex w-full flex-1 flex-col sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl sm:px-0 sm:pb-16 sm:pt-0 pb-12 pt-6">
          {children}
        </div>
        {modal}
      </body>
    </html>
  );
}
