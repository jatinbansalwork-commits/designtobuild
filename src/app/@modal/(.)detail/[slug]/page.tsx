import { notFound, redirect } from "next/navigation";
import { DetailModal } from "@/components/detail-modal";
import { getDetailBySlug } from "@/lib/details-data";

interface DetailModalPageProps {
  params: Promise<{ slug: string }>;
}

export default async function InterceptedDetailPage({ params }: DetailModalPageProps) {
  const { slug } = await params;
  if (slug === "upcoming") redirect("/detail/freshprints");

  const detail = getDetailBySlug(slug);
  if (!detail) notFound();

  return <DetailModal detail={detail} />;
}
