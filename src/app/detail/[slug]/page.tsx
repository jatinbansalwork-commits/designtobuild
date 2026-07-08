import { notFound } from "next/navigation";
import { DetailModal } from "@/components/detail-modal";
import { GRID_DETAILS, getDetailBySlug } from "@/lib/details-data";
import { SITE_NAME } from "@/lib/seo";
import { getDetailShareUrl } from "@/lib/site-url";

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const seen = new Set<string>();
  return GRID_DETAILS.filter((detail) => {
    if (seen.has(detail.slug)) return false;
    seen.add(detail.slug);
    return true;
  }).map((detail) => ({ slug: detail.slug }));
}

export async function generateMetadata({ params }: DetailPageProps) {
  const { slug } = await params;
  const detail = getDetailBySlug(slug);
  if (!detail) return {};

  const url = getDetailShareUrl(slug);
  const description =
    detail.description ??
    `Explore ${detail.title} on ${SITE_NAME} — curated design and build projects.`;

  return {
    title: detail.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: detail.title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: detail.title,
      description,
    },
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const detail = getDetailBySlug(slug);
  if (!detail) notFound();

  return (
    <div className="min-h-screen bg-surface">
      <DetailModal detail={detail} standalone />
    </div>
  );
}
