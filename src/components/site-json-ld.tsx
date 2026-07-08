import { GRID_DETAILS } from "@/lib/details-data";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { getDetailShareUrl, getSiteUrl } from "@/lib/site-url";

export function SiteJsonLd() {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: siteUrl,
        inLanguage: "en",
      },
      ...GRID_DETAILS.map((detail) => ({
        "@type": "CreativeWork",
        name: detail.title,
        description: detail.seoDescription,
        url: getDetailShareUrl(detail.slug, siteUrl),
        datePublished: detail.date,
        author: {
          "@type": "Person",
          name: detail.author,
        },
        keywords: [...detail.categories, ...(detail.portfolioTags ?? [])].join(", "),
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: siteUrl,
        },
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
