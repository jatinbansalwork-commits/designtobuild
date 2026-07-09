import { notFound, redirect } from "next/navigation";
import { DetailModal } from "@/components/detail-modal";
import { buildDetailMetadata } from "@/lib/detail-seo";
import { GRID_DETAILS, getDetailBySlug } from "@/lib/details-data";

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
  return buildDetailMetadata(detail);
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  if (slug === "upcoming") redirect("/detail/freshprints");

  const detail = getDetailBySlug(slug);
  if (!detail) notFound();

  return (
    <div className="min-h-screen bg-surface">
      <DetailModal detail={detail} standalone />
    </div>
  );
}
